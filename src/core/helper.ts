import { RouteObject } from 'react-router-dom'
import { type ResourceProps } from '@refinedev/core'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface App {
  addRouter: (routes: RouteObject[]) => void
  getRouter: () => RouteObject[]
  addResources: (resource: ResourceProps[]) => void
  getResources: () => ResourceProps[]
}

export const createApp = (): App => {
  let routers: RouteObject[] = []
  const addRouter = (routes: RouteObject[]) => {
    routers = [...routers, ...routes]
  }
  const getRouter = () => {
    return routers
  }

  let resources: ResourceProps[] = []
  const addResources = (resource: ResourceProps[]) => {
    resources = [...resources, ...resource]
  }
  const getResources = () => {
    return resources
  }

  return {
    addRouter,
    getRouter,
    addResources,
    getResources,
  }
}

export const useWindowSize = (): [number, Record<string, number>] => {
  const [width, setWidth] = useState<number>(0)
  

  const sizeEmit = useMemo(() => {
    return {
      sm: 0,
      md: 1,
      lg: 2,
      xl: 3,
      xxl: 4,
    }
  }, [])

  type GetSizeHandler = (width: number) => [number, Record<string, number>]

  const getSize = useCallback<GetSizeHandler>(
    (width) => {
      if (width < 640) {
        return [sizeEmit.sm, sizeEmit]
      } else if (width < 768) {
        return [sizeEmit.md, sizeEmit]
      } else if (width < 1024) {
        return [sizeEmit.lg, sizeEmit]
      } else if (width < 1280) {
        return [sizeEmit.xl, sizeEmit]
      } else {
        return [sizeEmit.xxl, sizeEmit]
      }
    },
    [sizeEmit]
  )

  useEffect(() => {
    const handler = () => {
      setWidth(window.innerWidth)
    }
    handler()
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return getSize(width)
}
