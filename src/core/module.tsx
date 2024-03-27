import React, { createContext, useContext, useState } from 'react'
import NiceModal from '@ebay/nice-modal-react'
import { Config, userMenuItem } from './config'

interface ModuleContext {
  name: string
  config: Config
  userMenu?: userMenuItem[]
}

const moduleContext = createContext<ModuleContext>({} as ModuleContext)

export const useModuleContext = () => {
  return useContext(moduleContext)
}

interface ModuleProps {
  children: React.ReactNode
  name: string
  config: Config
  userMenu?: userMenuItem[]
}

export const Module = (props: ModuleProps) => {


  const [modalList, setModalList] = useState([])

  return (
    <moduleContext.Provider
      value={{ name: props.name, config: props.config, userMenu: props.userMenu }}
    >
      <NiceModal.Provider>
      {props.children}
      </NiceModal.Provider>
    </moduleContext.Provider>
  )
}


Module.openModal = () => {
  
}