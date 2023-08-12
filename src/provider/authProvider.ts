import config from '@/config'
import { client } from './dataProvider'
import { AuthBindings, HttpError } from '@refinedev/core'

export const authProvider = (app: string): AuthBindings => {
  return {
    login: async ({ username, password }) => {
      return await client
        .post(
          config.apiUrl + '/' + (config.resourcesPrefix ? app + '/' : '') + config.apiPath.login,
          {
            username: username,
            password: password,
          }
        )
        .then((res) => {
          localStorage.setItem(app + ':auth', JSON.stringify(res?.data))
          return {
            success: true,
            redirectTo: '/' + app,
          }
        })
        .catch((error) => {
          return {
            success: false,
            error: error,
          }
        })
    },
    logout: async () => {
      localStorage.removeItem(app + ':auth')
      return {
        success: true,
        redirectTo: `/${app}/login`,
      }
    },
    check: async () => {
      const auth = localStorage.getItem(app + ':auth')
      if (auth) {
        return {
          authenticated: true,
        }
      }
      return {
        authenticated: false,
        redirectTo: `/${app}/login`,
      }
    },
    getPermissions: () => {
      const auth = localStorage.getItem(app + ':auth')
      if (auth) {
        const { permission } = JSON.parse(auth)
        return permission
      }
      return null
    },
    getIdentity: async () => {
      const auth = localStorage.getItem(app + ':auth')
      if (auth) {
        const data = JSON.parse(auth)
        return data
      }
      return undefined
    },
    register: async ({ username, password }) => {
      return await client
        .post(
          config.apiUrl + '/' + (config.resourcesPrefix ? app + '/' : '') + config.apiPath.register,
          {
            username: username,
            password: password,
          }
        )
        .then((res) => {
          localStorage.setItem(app + ':auth', JSON.stringify(res))
          return {
            success: true,
            redirectTo: `/${app}/login`,
          }
        })
        .catch((error) => {
          return {
            success: false,
            error: error as HttpError,
          }
        })
    },
    forgotPassword: async ({ username, code }) => {
      return await client
        .post(
          config.apiUrl +
            '/' +
            (config.resourcesPrefix ? app + '/' : '') +
            config.apiPath.forgotPassword,
          {
            username: username,
            code: code,
          }
        )
        .then((res) => {
          localStorage.setItem(app + ':auth', JSON.stringify(res))
          return {
            success: true,
            redirectTo: `/${app}/login`,
          }
        })
        .catch((error) => {
          return {
            success: false,
            error: error as HttpError,
          }
        })
    },
    updatePassword: async ({ username, password, newPassword }) => {
      return await client
        .post(
          config.apiUrl + '/' + (config.resourcesPrefix ? app + '/' : '') + config.apiPath.register,
          {
            username: username,
            password: password,
            newPassword: newPassword,
          }
        )
        .then((res) => {
          localStorage.setItem(app + ':auth', JSON.stringify(res))
          return {
            success: true,
            redirectTo: `/${app}/login`,
          }
        })
        .catch((error) => {
          return {
            success: false,
            error: error as HttpError,
          }
        })
    },
    onError: async (error) => {
      if (error.status === 401) {
        return {
          logout: true,
          redirectTo: `/${app}/login`,
          error,
        }
      }
      return {}
    },
  }
}
