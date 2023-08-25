import { createContext, useContext } from 'react'
import { Config } from './config'

interface ModuleContext {
  name: string
  config: Config
}

const moduleContext = createContext<ModuleContext>({} as ModuleContext)

export const useModuleContext = () => {
  return useContext(moduleContext)
}

interface ModuleProps {
  children: React.ReactNode
  name: string
  config: Config
}
export const Module = (props: ModuleProps) => {
  return (
    <moduleContext.Provider value={{ name: props.name, config: props.config }}>
      {props.children}
    </moduleContext.Provider>
  )
}
