import { useCallback, useEffect, useMemo } from 'react'
import { useMenu as useRefMenu } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { useCanHelper } from '../../provider'
import { useModuleContext } from '../../core/module'

export const useMenu = () => {
  const { defaultOpenKeys, menuItems } = useRefMenu({
    hideOnMissingParameter: true,
  })

  const { name } = useModuleContext()
  const { check } = useCanHelper(name)

  const sortData = useCallback((arr: TreeMenuItem[]) => {
    arr.sort((a, b) => a.meta.sort - b.meta.sort)
    for (const item of arr) {
      if (Array.isArray(item.children)) {
        sortData(item.children)
      }
    }
  }, [])

  const menuData = useMemo(() => {
    const filterMenuItems = (menuItems: TreeMenuItem[]) => {
      return menuItems.filter((item) => {
        if (!item.meta?.label) {
          return false
        }
        if (item.children.length > 0) {
          item.children = filterMenuItems(item.children)
        }
        return check({ resource: item.name, action: 'list' })
      })
    }
    const data = filterMenuItems(menuItems)
    sortData(data)
    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems])

  return {
    menuData,
    defaultOpenKeys,
  }
}
