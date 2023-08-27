import { useState } from 'react'
import { useTranslate, UseFormReturnType } from '@refinedev/core'
import { Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { Form, FormProps } from './form'

export interface FormModalProps extends FormProps {
  onClose?: () => void
}
export const FormModal = ({ children, onClose, onData, onSubmit, ...props }: FormModalProps) => {
  const modal = useModal()
  const translate = useTranslate()

  const [loading, setLoading] = useState(false)

  const onDataFn = (form: UseFormReturnType) => {
    setLoading(form.formLoading)
    onData?.(form)
  }

  const onSubmitFun = async (e: SubmitContext) => {
    await onSubmit?.(e)
    await onClose?.()
    await modal.onClose?.()
  }
  return (
    <Form
      onSubmit={onSubmitFun}
      formProps={{
        labelAlign: 'top',
      }}
      onData={onDataFn}
      {...props}
    >
      <div className='p-6'>{children}</div>
      <Modal.Footer>
        <Button
          variant='outline'
          onClick={() => {
            onClose?.()
            modal.onClose?.()
          }}
        >
          {translate('buttons.cancel')}
        </Button>
        <Button type='submit' loading={loading}>
          {translate('buttons.save')}
        </Button>
      </Modal.Footer>
    </Form>
  )
}
