
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Modal, ModalProps } from './index'

export default NiceModal.create(({ ...props }: ModalProps) => {
  const modal = useModal()
  return (
    <Modal
      open={modal.visible}
      onClose={() => {
        props?.onClose?.()
        modal.hide()
      }}
      onClosed={() => {
        props?.onClosed?.()
        modal.remove()
      }}
      {...props}
    />
  )
})
