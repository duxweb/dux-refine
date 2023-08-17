import React, { createContext, useContext, useMemo } from 'react'
import {
  RouteObject,
  BrowserRouter,
  RouterProvider,
  createHashRouter,
  Navigate,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { I18nProvider } from '@refinedev/core'
import { ResourceRouteComposition } from '@refinedev/core/dist/interfaces/bindings/resource'

import { createRefine } from './package'
import { App } from './helper'
import { Config } from './config'

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
  const { t, i18n } = useTranslation()

  const i18nProvider = useMemo<I18nProvider>(() => {
    return {
      translate: (key: string, params: object) => t(key, params),
      changeLocale: (lang: string) => i18n.changeLanguage(lang),
      getLocale: () => i18n.language,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const apps = useMemo<Record<string, App>>(() => {
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

    return apps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appsData])

  const router = useMemo(() => {
    const routes: RouteObject[] = [
      {
        index: true,
        element: <Navigate to={'/' + config.defaultApp} />,
      },
    ]

    const formatResources = (
      res?: ResourceRouteComposition
    ): ResourceRouteComposition | undefined => {
      return typeof res === 'string' ? ['/:app', res].join('/') : res
    }

    Object.keys(apps).map((name) => {
      const refine = createRefine({
        name: name,
        prefix: name ? '/:app' : undefined,
        config: config,
        i18nProvider: i18nProvider,
        router: apps[name].getRouter(),
        resources: apps[name].getResources().map((item) => {
          item.list = formatResources(item.list)
          item.create = formatResources(item.create)
          item.clone = formatResources(item.clone)
          item.edit = formatResources(item.edit)
          item.show = formatResources(item.show)
          item.meta = {
            ...item.meta,
            app: name,
          }
          return item
        }),
      })
      routes.push(refine)
    })
    return createHashRouter(routes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps])

  return (
    <appContext.Provider
      value={{
        config: config,
      }}
    >
      <BrowserRouter>
        <RouterProvider router={router} />
      </BrowserRouter>
    </appContext.Provider>
  )
}
