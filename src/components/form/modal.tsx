import { RefObject, useEffect, useRef, useState } from 'react'
import { useTranslate } from '@refinedev/core'
import { Form as TdForm, Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { Form, FormProps, FormRef } from './form'
import clsx from 'clsx'

export interface FormModalProps extends FormProps {
  onClose?: () => void
  padding?: boolean
  onRef?: (ref: RefObject<FormRef>) => void
}

export const FormModal = ({
  children,
  onClose,
  onSubmit,
  padding = true,
  onRef,
  form: tdForm,
  ...props
}: FormModalProps) => {
  const formRef = useRef<FormRef>(null)
  const modal = useModal()
  const translate = useTranslate()
  const [form] = TdForm.useForm(tdForm)
  const [loading, setLoading] = useState(false)

  const onSubmitFun = async (e: SubmitContext) => {
    setLoading(true)
    await onSubmit?.(e)
    if (e.validateResult === true) {
      await onClose?.()
      await modal.onClose?.()
    }
    setLoading(false)
  }

  useEffect(() => {
    onRef?.(formRef)
  }, [onRef])

  return (
    <Form
      ref={formRef}
      form={form}
      onSubmit={onSubmitFun}
      formProps={{
        labelAlign: 'top',
      }}
      {...props}
    >
      <div className={clsx([padding ? 'p-5' : ''])}>{children}</div>
      <Modal.Footer>
        <Button
          variant='outline'
          type='button'
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

FormModal.displayName = 'FormModal'
