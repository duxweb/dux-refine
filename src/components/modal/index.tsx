import clsx from 'clsx'
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
  useEffect,
} from 'react'
import { Dialog } from 'tdesign-react/esm'
import NiceModal from '@ebay/nice-modal-react'
import CreateModal from './create'

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
  onClosed?: () =>void
}

interface TriggerProps {
  onClick: () => void
}

const ModalComp = forwardRef<ModalContextProps, ModalProps>(
  (
    {
      title,
      trigger,
      children,
      component,
      componentProps,
      onClose,
      onClosed,
      className,
      width,
      open,
      defaultOpen = false,
    },
    ref
  ) => {
    const [status, setStatus] = useState(defaultOpen)
    const AsyncContent = component ? lazy(component) : undefined

    const onCloseFun = useCallback(() => {
      setStatus(false)
      onClose?.()
    }, [onClose])

    useImperativeHandle(ref, () => ({
      onClose: onCloseFun,
    }))

    useEffect(() => {
      if (open == undefined) {
        return
      }
      setStatus(open)
    }, [open])

    return (
      <>
        {React.isValidElement(trigger) &&
          React.cloneElement(trigger, {
            onClick: () => {
              setStatus(true)
            },
          })}
        <context.Provider value={{ onClose: onCloseFun }}>
          <Dialog
            visible={status}
            onClose={onCloseFun}
            onClosed={onClosed}
            destroyOnClose
            header={title}
            footer={null}
            closeOnOverlayClick={false}
            closeOnEscKeydown={false}
            draggable={true}
            className={clsx(['app-modal', className])}
            style={{
              width: width,
              maxWidth: '100%',
            }}
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
          </Dialog>
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
  return <div className='t-dialog__footer'>{children}</div>
}

const ModalOpen = (props: ModalProps) => {
  return NiceModal.show(CreateModal, props)
}


type ModalType = typeof ModalComp & {
  Footer: typeof ModalFooter
  open: typeof ModalOpen
}

export const Modal = ModalComp as ModalType
Modal.Footer = ModalFooter
Modal.open = ModalOpen