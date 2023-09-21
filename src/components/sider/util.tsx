import { useCallback, useEffect, useState } from 'react'
import { useGetIdentity, useMenu as useRefMenu } from '@refinedev/core'
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
  const { defaultOpenKeys, menuItems } = useRefMenu({
    hideOnMissingParameter: true,
  })
  const [menuData, setMenuData] = useState<MenuItemProps[]>([])

  const sortData = useCallback((arr: MenuItemProps[]) => {
    arr.sort((a, b) => a.sort - b.sort)
    for (const item of arr) {
      if (Array.isArray(item.children)) {
        sortData(item.children)
      }
    }
  }, [])

  const { data: identity } = useGetIdentity<{
    token: string
  }>()

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
        setMenuData(res?.data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiPath.menu, identity?.token])

  useEffect(() => {
    if (config.apiPath.menu) {
      return
    }
    const filterMenuItems = (menuItems: TreeMenuItem[]) => {
      return menuItems
        .filter((item) => {
          if (!item.meta?.label) {
            return false
          }
          if (item.children.length > 0) {
            item.children = filterMenuItems(item.children)
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
    }
    const data = filterMenuItems(menuItems)
    sortData(data)
    setMenuData(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems, config.apiPath.menu])

  return {
    menuData: menuData,
    defaultOpenKeys,
  }
}
