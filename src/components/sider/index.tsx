import { createContext, useContext, useState, Dispatch, SetStateAction } from 'react'
import { useMenu } from '@refinedev/core'
import { Main } from './main'
import { Sub } from './sub'

export interface SiderContextProps {
  active: string[]
  setActive: Dispatch<SetStateAction<string[]>>
  collapse: boolean
  setCollapse: Dispatch<SetStateAction<boolean>>
}

export const siderContext = createContext<SiderContextProps>({} as SiderContextProps)

export const useSiderContext = () => {
  return useContext(siderContext)
}

export const Sider = () => {
  const { defaultOpenKeys } = useMenu()
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
      }}
    >
      <div className='z-1 hidden flex-none flex-row md:flex'>
        <Main />
        <Sub />
      </div>
    </siderContext.Provider>
  )
}
