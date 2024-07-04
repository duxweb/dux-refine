import { RouteObject } from 'react-router-dom'
import { type ResourceProps } from '@refinedev/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { userMenuItem } from './config'

interface ResourceModuleProps extends ResourceProps {
  /**
   * @deprecated change the name to listComponent
   */
  listElenemt?: React.ReactNode | null
  /**
   * @deprecated change the name to createComponent
   */
  createElenemt?: React.ReactNode | null
  /**
   * @deprecated change the name to cloneComponent
   */
  cloneElenemt?: React.ReactNode | null
  /**
   * @deprecated change the name to editComponent
   */
  editElenemt?: React.ReactNode | null
  /**
   * @deprecated change the name to showComponent
   */
  showElenemt?: React.ReactNode | null

  listComponent?: React.ReactNode | null
  createComponent?: React.ReactNode | null
  cloneComponent?: React.ReactNode | null
  editComponent?: React.ReactNode | null
  showComponent?: React.ReactNode | null
}

interface ResourceIndex {
  name: string
  component: React.ReactNode
}

export interface App {
  addIndexs: (index: ResourceIndex[]) => void
  getIndexs: () => ResourceIndex[]
  addRouter: (routes: RouteObject[]) => void
  getRouter: () => RouteObject[]
  addResources: (resource: ResourceModuleProps[]) => void
  getResources: () => ResourceProps[]
  getUserMenu: () => Array<userMenuItem>
  setUserMenu: (menu: Array<userMenuItem>) => void
}

export const createApp = (): App => {
  let routers: RouteObject[] = []
  let resources: ResourceProps[] = []
  let indexs: ResourceIndex[] = []

  const addIndexs = (index: ResourceIndex[]) => {
    indexs = [...indexs, ...index]
  }
  const getIndexs = () => {
    return indexs
  }

  const addResources = (resource: ResourceModuleProps[]) => {
    resource = resource?.map((item) => {
      const listComponent = item.listComponent || item.listElenemt
      const createComponent = item.createComponent || item.createElenemt
      const cloneComponent = item.cloneComponent || item.cloneElenemt
      const editComponent = item.editComponent || item.editElenemt
      const showComponent = item.showComponent || item.showElenemt

      if (listComponent && typeof item.list == 'string') {
        routers.push({
          path: item.list,
          element: listComponent,
        })
      }
      if (createComponent && typeof item.create == 'string') {
        routers.push({
          path: item.create,
          element: createComponent,
        })
      }
      if (cloneComponent && typeof item.clone == 'string') {
        routers.push({
          path: item.clone,
          element: cloneComponent,
        })
      }
      if (editComponent && typeof item.edit == 'string') {
        routers.push({
          path: item.edit,
          element: editComponent,
        })
      }
      if (showComponent && typeof item.show == 'string') {
        routers.push({
          path: item.show,
          element: showComponent,
        })
      }
      return item
    })
    resources = [...resources, ...resource]
  }
  const getResources = () => {
    return resources
  }

  const addRouter = (routes: RouteObject[]) => {
    routers = [...routers, ...routes]
  }
  const getRouter = () => {
    return routers
  }

  let userMenu: Array<userMenuItem> = []
  const setUserMenu = (menu: Array<userMenuItem>) => {
    userMenu = menu
  }
  const getUserMenu = () => {
    return userMenu
  }

  return {
    addIndexs,
    getIndexs,
    addRouter,
    getRouter,
    addResources,
    getResources,
    setUserMenu,
    getUserMenu,
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
    [sizeEmit],
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
