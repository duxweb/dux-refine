import { Authenticated, Refine, CanAccess } from '@refinedev/core'
import routerBindings, { CatchAllNavigate, NavigateToResource } from '@refinedev/react-router-v6'
import type { I18nProvider, ResourceProps, NotificationProvider } from '@refinedev/core'
import { ComponentType, Suspense, lazy } from 'react'
import { Message, MessageProps, Spin } from '@arco-design/web-react'
import { RouteObject, Outlet } from 'react-router-dom'
import { Layout } from '../components/layout/layout'
import { dataProvider } from '../provider/dataProvider'
import { Login } from '../pages/login'
import { Error } from '../pages/common/error'
import { Register } from '../pages/register'
import { ForgotPassword } from '../pages/forgotPassword'
import { Config, userMenuItem } from './config'
import { authProvider } from '../provider/authProvider'
import { canProvider } from '../provider/canProvider'
import { Unauthorized } from '../pages/common/unauthorized'
import { Module } from './module'
import { ErrorBoundary } from '../pages/common/boundary'

export const lazyComponent = (importComp: () => Promise<{ default: ComponentType<any> }>) => {
  const Comp = lazy(importComp)
  return (
    <Suspense
      fallback={
        <Spin block loading={true}>
          <div className='absolute z-1000 w-screen h-screen'></div>
        </Spin>
      }
    >
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
  userMenu?: userMenuItem[]
}

interface MessageType {
  (): void
}

export const createRefine = ({
  name,
  prefix,
  i18nProvider,
  router,
  resources,
  config,
  userMenu,
}: createRefineProps): RouteObject => {
  const notifyMaps: Record<string, MessageType> = {}

  const notificationProvider: NotificationProvider = {
    open: ({ message, description, key, type, undoableTimeout }) => {
      const notifyConfig: MessageProps = {
        content: description || message,
        onClose: () => {
          if (key) {
            delete notifyMaps[key]
          }
        },
      }
      if (type === 'success') {
        const msg = Message.success(notifyConfig)
        if (key) {
          notifyMaps[key] = msg
        }
      }
      if (type === 'error') {
        const msg = Message.error(notifyConfig)
        if (key) {
          notifyMaps[key] = msg
        }
      }
      if (type === 'progress') {
        const msg = Message.warning({
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
        notifyMaps[key]()
      }
    },
  }

  return {
    path: prefix,
    element: (
      <Refine
        dataProvider={dataProvider(name, config)}
        authProvider={authProvider(name, config)}
        accessControlProvider={canProvider(name)}
        i18nProvider={i18nProvider}
        routerProvider={routerBindings}
        notificationProvider={notificationProvider}
        resources={resources}
        options={{
          disableTelemetry: true,
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          projectId: config.projectId,
        }}
      >
        <Module name={name} config={config} userMenu={userMenu}>
          <Outlet />
        </Module>
      </Refine>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: (
          <Authenticated fallback={<CatchAllNavigate to='login' />}>
            <Layout>
              <CanAccess fallback={<Unauthorized />}>
                <Outlet />
              </CanAccess>
            </Layout>
          </Authenticated>
        ),
        children: [
          ...router,
          {
            path: '*',
            element: <Error />,
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
          {
            path: 'update-password',
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  }
}
