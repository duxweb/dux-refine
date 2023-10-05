import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGetIdentity, useParsed, useMenu as useRefMenu } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { client, useCanHelper } from '../../provider'
import { useModuleContext } from '../../core/module'

export interface MenuItemProps {
  name: string
  key: string
  route: string
  icon: string
  label: string
  sort: number
  children: MenuItemProps[]
}

export interface UseMenuProps {
  menuData: MenuItemProps[]
  defaultOpenKeys: string[]
}

export const useMenu = (): UseMenuProps => {
  const { name, config } = useModuleContext()
  const { check } = useCanHelper(name)
  const { menuItems } = useRefMenu({
    hideOnMissingParameter: true,
  })
  const { pathname } = useParsed()
  const [apiMenuData, setApiMenuData] = useState<MenuItemProps[]>([])

  const sortData = useCallback((arr: MenuItemProps[]) => {
    arr.sort((a, b) => a.sort - b.sort)
    for (const item of arr) {
      if (Array.isArray(item.children)) {
        sortData(item.children)
      }
    }
  }, [])

  const formatMenu = useCallback(
    (data: TreeMenuItem[]) => {
      return data
        .filter((item) => {
          if (!item?.meta?.label && !item?.label) {
            return false
          }
          if (item?.children?.length > 0) {
            item.children = formatMenu(item.children)
          }
          return check({ resource: item.name, action: 'list' })
        })
        .map((item) => {
          return {
            name: item.name,
            key: item.key,
            route: item.route || undefined,
            icon: item.icon,
            label: item.label,
            children: item.children,
            sort: item?.sort || item?.meta?.sort || 0,
          } as MenuItemProps
        })
    },
    [check]
  )

  const { data: identity } = useGetIdentity<{
    token: string
  }>()

  const refineMenuData = useMemo(() => {
    return formatMenu(menuItems)
  }, [formatMenu, menuItems])

  useEffect(() => {
    if (!config.apiPath.menu || !identity?.token) {
      return
    }
    client
      .get(`${config.apiUrl}/${config.resourcesPrefix ? name + '/' : ''}${config.apiPath.menu}`, {
        headers: {
          Authorization: identity.token,
        },
      })
      .then((res) => {
        setApiMenuData(formatMenu(res.data?.data || []))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.token, formatMenu, config])

  const menuData = useMemo(() => {
    const array1 = [...apiMenuData] // your first array
    const array2 = [...refineMenuData]
    mergeByProperty(array1, array2)
    sortData(array1)
    return array1
  }, [apiMenuData, refineMenuData, sortData])

  const openkeys = useMemo(() => {
    const pathList = getPathByKey(pathname || `/${name}`, menuData)
    return pathList.map((item) => item.key).reverse()
  }, [menuData, name, pathname])

  return {
    menuData: menuData,
    defaultOpenKeys: openkeys,
  }
}

const getPathByKey = (curKey: string, data: MenuItemProps[]) => {
  let result: MenuItemProps[] = []

  const traverse = (curKey: string | number, path: any[], data: MenuItemProps[]) => {
    if (data.length === 0) {
      return
    }
    for (const item of data) {
      path.push(item)
      if (item.route === curKey) {
        result = JSON.parse(JSON.stringify(path))
        return
      }

      const children = Array.isArray(item.children) ? item.children : []
      traverse(curKey, path, children)
      path.pop()
    }
  }
  traverse(curKey, [], data)
  return result
}

const mergeByProperty = (targetArray: MenuItemProps[], sourceArray: MenuItemProps[]) => {
  sourceArray.forEach((sourceElement) => {
    const targetElement = targetArray.find(
      (targetElement) => targetElement.name === sourceElement.name
    )

    if (!targetElement) {
      targetArray.push(sourceElement)
    } else {
      if (Array.isArray(sourceElement.children) && sourceElement.children.length > 0) {
        mergeByProperty(targetElement.children, sourceElement.children)
      }
    }
  })
}
