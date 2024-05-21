import React, { createContext, useContext, useMemo, useState } from 'react'
import { RouteObject, RouterProvider, createHashRouter, Navigate } from 'react-router-dom'
import { ResourceRouteComposition } from '@refinedev/core/dist/contexts/resource/types'

import { createRefine } from './package'
import { App } from './helper'
import { Config } from './config'
import { useI18nProvider } from '../provider'
import { Error } from '../pages/common/error'

export interface appContext {
  createApp: (name: string, app: App) => void
  getApp: (name: string) => App
  getApps: () => App[]
  addI18n: (lng: string, ns: string, resources: any) => void
  addI18ns: (files: Record<string, unknown>) => void
  addListener: (name: string, callback: any) => void
  config: Config
}

export interface appConfig {
  init?: (context: appContext) => void
  register?: (context: appContext) => void
  run?: (context: appContext) => void
}

export interface AppContext {
  config: Config
  event: Record<string, any>
}

const appContext = createContext<AppContext>({
  config: {} as Config,
  event: {},
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
  const [event, setEvent] = useState<Record<string, any>>({})

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

    const addI18ns = (files: Record<string, unknown>) => {
      for (const path in files) {
        const filename = path.split('/').pop()
        if (!filename) {
          continue
        }
        const names = filename.split('.')
        const messages = files[path] as Record<string, any>
        let packageName = 'common'
        let name = names[0]

        if (names[1] != 'json') {
          packageName = names[0]
          name = names[1]
        }
        i18n.addResourceBundle(name, packageName, messages.default)
      }
    }

    const addListener = (name: string, callback: any) => {
      setEvent((e) => {
        return { ...e, callback }
      })
    }

    appsData.map((item) => {
      item?.init?.({ createApp, getApp, getApps, addI18n, addI18ns, addListener, config })
    })

    appsData.map((item) => {
      item?.register?.({ createApp, getApp, getApps, addI18n, addI18ns, addListener, config })
    })

    appsData.map((item) => {
      item?.run?.({ createApp, getApp, getApps, addI18n, addI18ns, addListener, config })
    })

    const routes: RouteObject[] = [
      {
        index: true,
        element: <Navigate to={'/' + config.defaultApp} />,
      },
    ]

    const formatResources = (
      name: string,
      res?: ResourceRouteComposition,
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
        event: event,
      }}
    >
      <RouterProvider router={router} />
    </appContext.Provider>
  )
}
