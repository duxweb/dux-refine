import { AccessControlProvider, CanParams, CanReturnType } from '@refinedev/core'
import { useCallback } from 'react'

interface CanHelper {
  check: ({ resource, action }: CanCheck) => boolean
}

export const useCanHelper = (app: string): CanHelper => {
  const auth = localStorage.getItem(app + ':auth')
  const { permission } = JSON.parse(auth || '')
  const check = useCallback(
    ({ resource, action }: CanCheck) => {
      return canCheck({ permission, resource, action })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  )
  return { check }
}

interface CanCheck {
  permission?: Record<string, any> | null
  resource?: string
  action?: string | string[]
}

export const canCheck = ({ permission, resource, action }: CanCheck) => {
  if (!resource) {
    return true
  }

  if (!permission) {
    return false
  }

  if (typeof permission !== 'object') {
    return true
  }

  if (!Array.isArray(action) && permission[resource + '.' + action] !== undefined) {
    return !!permission[resource + '.' + action]
  }

  if (Array.isArray(action)) {
    for (const item of action) {
      if (permission[resource + '.' + item] !== undefined) {
        return !!permission[resource + '.' + item]
      }
    }
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
      const { permission } = JSON.parse(auth || '')
      return {
        can: canCheck({ permission, resource, action }),
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
