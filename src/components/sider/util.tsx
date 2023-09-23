import { useCallback, useMemo, useState } from 'react'
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

  const [menuData, setMenuData] = useState<MenuItemProps[]>([])
  const [apiMenuData, setApiMenuData] = useState<MenuItemProps[]>([])

  const sortData = useCallback((arr: MenuItemProps[]) => {
    arr.sort((a, b) => a.sort - b.sort)
    for (const item of arr) {
      if (Array.isArray(item.children)) {
        sortData(item.children)
      }
    }
  }, [])

  const formatMenu = useCallback((menuItems: TreeMenuItem[]) => {
    return menuItems
      .filter((item) => {
        if (!item.meta?.label) {
          return false
        }
        if (item.children.length > 0) {
          item.children = formatMenu(item.children)
        }
        return check({ resource: item.name, action: 'list' })
      })
      .map((item) => {
        return {
          name: item.name,
          key: item.key,
          route: item.route,
          icon: item.icon,
          label: item.label,
          children: item.children,
          sort: item.meta.sort,
        } as MenuItemProps
      })
  }, [])

  const { data: identity } = useGetIdentity<{
    token: string
  }>()

  // api menu
  useMemo(() => {
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
        setApiMenuData(res.data?.data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiPath.menu, identity?.token])

  const openkeys = useMemo(() => {
    const pathList = getPathByKey(
      (name ? pathname?.replace(`/${name}/`, '') : pathname) || '',
      menuData
    )
    console.log(
      'path',
      pathList.map((item) => item.key)
    )
    return pathList.map((item) => item.key).reverse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuData, config.apiPath.menu])

  useMemo(() => {
    const data = formatMenu([...menuItems, apiMenuData])
    sortData(data)
    setMenuData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMenuData, menuItems, config.apiPath.menu])

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
