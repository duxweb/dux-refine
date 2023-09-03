import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'
import { TreeMenuItem } from '@refinedev/core/dist/hooks/menu/useMenu'
import { Main } from './app/main'
import { Sub } from './app/sub'
import { useMenu } from './util'

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

export const SiderApp = () => {
  const { defaultOpenKeys, menuData } = useMenu()
  const [active, setActive] = useState<string[]>(
    defaultOpenKeys.length > 0 ? defaultOpenKeys : ['/index']
  )
  const [collapse, setCollapse] = useState<boolean>(true)
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
