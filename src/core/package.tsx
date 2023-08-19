import { Authenticated, Refine } from '@refinedev/core'
import routerBindings, { CatchAllNavigate, NavigateToResource } from '@refinedev/react-router-v6'
import type { I18nProvider, ResourceProps, NotificationProvider } from '@refinedev/core'
import { ComponentType, Suspense, lazy } from 'react'
import { MessagePlugin, MessageInstance, TdMessageProps } from 'tdesign-react/esm'
import { RouteObject, Outlet } from 'react-router-dom'
import { Layout } from '../components/layout/layout'
import { dataProvider } from '../provider/dataProvider'
import { Login } from '../pages/login'
import { Register } from '../pages/register'
import { ForgotPassword } from '../pages/forgotPassword'
import { Config } from './config'
import { authProvider } from '../provider/authProvider'
import { ErrorComponent } from '../components'

export const lazyComponent = (importComp: () => Promise<{ default: ComponentType<any> }>) => {
  const Comp = lazy(importComp)
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Comp></Comp>
    </Suspense>
  )
}

export interface createRefineProps {
  name: string
  prefix?: string
  i18nProvider: I18nProvider
  router: RouteObject[]
  resources: ResourceProps[]
  config: Config
}

export const createRefine = ({
  name,
  prefix,
  i18nProvider,
  router,
  resources,
  config,
}: createRefineProps): RouteObject => {
  const notifyMaps: Record<string, Promise<MessageInstance>> = {}

  const notificationProvider: NotificationProvider = {
    open: ({ message, description, key, type, undoableTimeout }) => {
      const notifyConfig: TdMessageProps = {
        content: description || message,
        onClose: () => {
          if (key) {
            delete notifyMaps[key]
          }
        },
      }
      if (type === 'success') {
        const msg = MessagePlugin.success(notifyConfig)
        if (key) {
          notifyMaps[key] = msg
        }
      }
      if (type === 'error') {
        const msg = MessagePlugin.error(notifyConfig)
        if (key) {
          notifyMaps[key] = msg
        }
      }
      if (type === 'progress') {
        const msg = MessagePlugin.warning({
          ...notifyConfig,
          duration: undoableTimeout,
        })
        if (key) {
          notifyMaps[key] = msg
        }
      }
    },
    close: (key) => {
      if (Object.prototype.hasOwnProperty.call(notifyMaps, key)) {
        MessagePlugin.close(notifyMaps[key])
      }
    },
  }

  return {
    path: prefix,
    element: (
      <Refine
        dataProvider={dataProvider(name, config)}
        authProvider={authProvider(name, config)}
        i18nProvider={i18nProvider}
        routerProvider={routerBindings}
        notificationProvider={notificationProvider}
        resources={resources}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          projectId: config.projectId,
        }}
      >
        <Outlet />
      </Refine>
    ),
    children: [
      {
        element: (
          <Authenticated fallback={<CatchAllNavigate to='login' />}>
            <Layout>
              <Outlet />
            </Layout>
          </Authenticated>
        ),
        children: [
          ...router,
          {
            path: '*',
            element: <ErrorComponent />,
          },
        ],
      },
      {
        element: (
          <Authenticated fallback={<Outlet />}>
            <NavigateToResource />
          </Authenticated>
        ),
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  }
}
