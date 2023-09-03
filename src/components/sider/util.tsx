import { useMemo } from 'react'
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
    return filterMenuItems(menuItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems])

  return {
    menuData,
    defaultOpenKeys,
  }
}
