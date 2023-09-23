import { AccessControlProvider, CanParams, CanReturnType } from '@refinedev/core'
import { useCallback } from 'react'

interface CanHelper {
  check: ({ resource, action }: CanParams) => boolean
}

export const useCanHelper = (app: string): CanHelper => {
  const auth = localStorage.getItem(app + ':auth')
  const check = useCallback(
    ({ resource, action }: CanParams) => {
      return canCheck({ auth, resource, action })
    },
    [auth]
  )
  return { check }
}

interface CanCheck extends CanParams {
  auth: string | null
}

export const canCheck = ({ auth, resource, action }: CanCheck) => {
  if (!auth) {
    return false
  }
  if (!resource) {
    return true
  }

  const { permission } = JSON.parse(auth)

  if (!permission) {
    return false
  }

  if (typeof permission !== 'object') {
    return true
  }

  if (permission[resource + '.' + action] !== undefined) {
    return !!permission[resource + '.' + action]
  }

  if (permission[resource] !== undefined) {
    return !!permission[resource]
  }
  return true
}

export const canProvider = (app: string): AccessControlProvider => {
  return {
    can: async ({ resource, action }: CanParams): Promise<CanReturnType> => {
      const auth = localStorage.getItem(app + ':auth')
      return {
        can: canCheck({ auth, resource, action }),
      }
    },
    options: {
      buttons: {
        enableAccessControl: true,
        hideIfUnauthorized: true,
      },
    },
  }
}
