import { createContext, useContext, useState, Dispatch, SetStateAction, useMemo } from 'react'
import { AccessControlContext, useCan, useMenu } from '@refinedev/core'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { Main } from './main'
import { Sub } from './sub'
import { useCanHelper } from '../../provider'
import { useModuleContext } from '../../core/module'

export interface SiderContextProps {
  active: string[]
  setActive: Dispatch<SetStateAction<string[]>>
  collapse: boolean
  setCollapse: Dispatch<SetStateAction<boolean>>
  menuData?: TreeMenuItem[]
}

export const siderContext = createContext<SiderContextProps>({} as SiderContextProps)

export const useSiderContext = () => {
  return useContext(siderContext)
}

export const Sider = () => {
  const { defaultOpenKeys, menuItems } = useMenu()
  const [active, setActive] = useState<string[]>(
    defaultOpenKeys.length > 0 ? defaultOpenKeys : ['/index']
  )
  const [collapse, setCollapse] = useState<boolean>(true)
  const { name } = useModuleContext()
  const { check } = useCanHelper(name)
  const menuData = useMemo(() => {
    const filterMenuItems = (menuItems: TreeMenuItem[]) => {
      return menuItems.filter((item) => {
        if (item.children.length > 0) {
          item.children = filterMenuItems(item.children)
        }
        const result = check({ resource: item.name, action: 'list' })
        return result
      })
    }
    return filterMenuItems(menuItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItems])

  return (
    <siderContext.Provider
      value={{
        active,
        setActive,
        collapse,
        setCollapse,
        menuData,
      }}
    >
      <div className='z-1 hidden flex-none flex-row md:flex'>
        <Main />
        <Sub />
      </div>
    </siderContext.Provider>
  )
}
