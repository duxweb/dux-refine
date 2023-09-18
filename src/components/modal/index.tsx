import React, {
  ComponentType,
  Suspense,
  lazy,
  createContext,
  ReactNode,
  ReactElement,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useContext,
} from 'react'
import { Modal as ArcoModal } from '@arco-design/web-react'
import { useModuleContext } from '../../core'

export interface ModalContextProps {
  onClose?: () => void
}

const context = createContext<ModalContextProps>({})

export interface ModalProps {
  title?: string
  trigger?: ReactElement<TriggerProps>
  children?: ReactNode | ((close: () => void) => ReactNode)
  component?: () => Promise<{ default: ComponentType<any> }>
  componentProps?: Record<string, any>
  className?: string
  width?: number
  defaultOpen?: boolean
  open?: boolean
  onClose?: () => void
}

interface TriggerProps {
  onClick: () => void
}

const ModalComp = forwardRef<ModalContextProps, ModalProps>(
  ({ title, trigger, children, component, componentProps, onClose, defaultOpen = false }, ref) => {
    const [open, setOpen] = useState(defaultOpen)
    const AsyncContent = component ? lazy(component) : undefined

    const onCloseFun = useCallback(() => {
      setOpen(false)
      onClose?.()
    }, [onClose])

    useImperativeHandle(ref, () => ({
      onClose: onCloseFun,
    }))

    return (
      <>
        {React.isValidElement(trigger) &&
          React.cloneElement(trigger, {
            onClick: () => {
              setOpen(true)
            },
          })}
        <context.Provider value={{ onClose: onCloseFun }}>
          <ArcoModal
            visible={open}
            onCancel={onCloseFun}
            unmountOnExit
            title={title}
            footer={null}
            maskClosable={false}
            escToExit={false}
          >
            {component ? (
              <Suspense>
                {AsyncContent && <AsyncContent {...componentProps} onClose={onCloseFun} />}
              </Suspense>
            ) : typeof children === 'function' ? (
              children(onCloseFun)
            ) : (
              children
            )}
          </ArcoModal>
        </context.Provider>
      </>
    )
  }
)

ModalComp.displayName = 'Modal'

export const useModal = () => {
  return useContext(context)
}

export interface ModalFooterProps {
  children?: ReactNode
}
const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className='arco-modal-footer'>{children}</div>
}

type ModalType = typeof ModalComp & {
  Footer: typeof ModalFooter
}

export const Modal = ModalComp as ModalType
Modal.Footer = ModalFooter

export interface HookModalProps {
  title?: string
  component: () => Promise<{ default: ComponentType<any> }>
  componentProps?: Record<string, any>
  className?: string
  width?: number
  onClose?: () => void
}

export const useModuleModal = () => {
  const { modal } = useModuleContext()
  const open = (props: HookModalProps) => {
    const AsyncContent = lazy(props.component)
    return modal?.({
      title: props.title,
      content: (
        <Suspense>
          {AsyncContent && <AsyncContent {...props.componentProps} onClose={props.onClose} />}
        </Suspense>
      ),
    })
  }
  return {
    open: open,
  }
}
