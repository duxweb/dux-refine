import React, { createContext, useContext } from 'react'
import { Modal } from '@arco-design/web-react'
import { Config, userMenuItem } from './config'
import { ConfirmProps } from '@arco-design/web-react/es/Modal/confirm'

interface ModuleContext {
  name: string
  config: Config
  userMenu?: userMenuItem[]
  modal: (props: ConfirmProps) => (() => void) | undefined
}

const moduleContext = createContext<ModuleContext>({} as ModuleContext)

export const useModuleContext = () => {
  return useContext(moduleContext)
}

interface ModuleProps extends ModuleContext {
  children: React.ReactNode
}
export const Module = (props: ModuleProps) => {
  const [modal, contextHolder] = Modal.useModal()

  const modalHook = (props: ConfirmProps) => {
    if (!modal.info) {
      return
    }
    const { close } = modal.info({
      simple: false,
      icon: false,
      ...props,
    })
    return close
  }

  return (
    <moduleContext.Provider
      value={{ name: props.name, config: props.config, userMenu: props.userMenu, modal: modalHook }}
    >
      {contextHolder}
      {props.children}
    </moduleContext.Provider>
  )
}
