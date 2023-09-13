import React, { createContext, useContext, useMemo } from 'react'
import { RouteObject, RouterProvider, createHashRouter, Navigate } from 'react-router-dom'
import { ResourceRouteComposition } from '@refinedev/core/dist/interfaces/bindings/resource'

import { createRefine } from './package'
import { App } from './helper'
import { Config } from './config'
import { useI18nProvider } from '../provider'
import { Error } from '../pages/common/error'
import { SearchIcon } from 'tdesign-icons-react'

export interface appContext {
  createApp: (name: string, app: App) => void
  getApp: (name: string) => App
  getApps: () => App[]
  addI18n: (lng: string, ns: string, resources: any) => void
}

export interface appConfig {
  init?: (context: appContext) => void
  register?: (context: appContext) => void
  run?: (context: appContext) => void
}

export interface AppContext {
  config: Config
}

const appContext = createContext<AppContext>({
  config: {} as Config,
})

export const useAppContext = (): AppContext => {
  return useContext(appContext)
}

export interface AppProviderProps {
  appsData: appConfig[]
  config: Config
}

export const AppProvider = ({ appsData, config }: AppProviderProps) => {
  const { i18nProvider, i18n } = useI18nProvider()

  const router = useMemo(() => {
    const apps: Record<string, App> = {}

    const createApp = (name: string, app: App) => {
      apps[name] = app
    }

    const getApp = (name: string): App => {
      return apps[name]
    }

    const getApps = (): App[] => {
      return Object.values(apps.current)
    }

    const addI18n = (lng: string, ns: string, resources: any) => {
      i18n.addResourceBundle(lng, ns, resources)
    }

    appsData.map((item) => {
      item?.init?.({ createApp, getApp, getApps, addI18n })
    })

    appsData.map((item) => {
      item?.register?.({ createApp, getApp, getApps, addI18n })
    })

    appsData.map((item) => {
      item?.run?.({ createApp, getApp, getApps, addI18n })
    })

    const routes: RouteObject[] = [
      {
        index: true,
        element: <Navigate to={'/' + config.defaultApp} />,
      },
    ]

    const formatResources = (
      name: string,
      res?: ResourceRouteComposition
    ): ResourceRouteComposition | undefined => {
      return typeof res === 'string' ? [`/${name}`, res].join('/') : res
    }

    Object.keys(apps).map((name) => {
      const refine = createRefine({
        name: name,
        prefix: name ? `/${name}` : undefined,
        config: config,
        i18nProvider: i18nProvider,
        router: apps[name].getRouter(),
        userMenu: apps[name].getUserMenu(),
        resources: apps[name].getResources().map((item) => {
          item.list = formatResources(name, item.list)
          item.create = formatResources(name, item.create)
          item.clone = formatResources(name, item.clone)
          item.edit = formatResources(name, item.edit)
          item.show = formatResources(name, item.show)
          item.meta = {
            ...item.meta,
            app: name,
          }
          return item
        }),
      })
      routes.push(refine)
    })

    routes.push({
      path: '*',
      element: (
        <div className='h-screen'>
          <Error />
        </div>
      ),
    })
    return createHashRouter(routes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appsData, config, i18nProvider])

  return (
    <appContext.Provider
      value={{
        config: config,
      }}
    >
      <RouterProvider router={router} />
    </appContext.Provider>
  )
}
