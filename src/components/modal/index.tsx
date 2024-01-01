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
} from 'react'
import { Dialog, DialogPlugin } from 'tdesign-react/esm'

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
  (
    {
      title,
      trigger,
      children,
      component,
      componentProps,
      onClose,
      className,
      width,
      defaultOpen = false,
    },
    ref
  ) => {
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
          <Dialog
            visible={open}
            onClose={onCloseFun}
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

type ModalType = typeof ModalComp & {
  Footer: typeof ModalFooter
}

export const Modal = ModalComp as ModalType
Modal.Footer = ModalFooter

export const ModalOpen = ({ title, children, component, componentProps, onClose }: ModalProps) => {
  const AsyncContent = component ? lazy(component) : undefined

  const dialogNode = DialogPlugin({
    onClose: onClose,
    destroyOnClose: true,
    footer: null,
    closeOnOverlayClick: false,
    closeOnEscKeydown: false,
    draggable: true,
    header: title,
    body: component ? (
      <Suspense>
        {AsyncContent && (
          <AsyncContent
            {...componentProps}
            onClose={() => {
              onClose?.()
              dialogNode.hide()
            }}
          />
        )}
      </Suspense>
    ) : typeof children === 'function' ? (
      children(() => {
        onClose?.()
        dialogNode.hide()
      })
    ) : (
      children
    ),
  })

  return dialogNode
}
