import { useRef, useState } from 'react'
import { useTranslate } from '@refinedev/core'
import { Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { Form, FormProps, FormRef } from './form'
import clsx from 'clsx'

export interface FormModalProps extends FormProps {
  onClose?: () => void
  padding?: boolean
}

export const FormModal = ({
  children,
  onClose,
  onSubmit,
  handleData,
  padding = true,
  ...props
}: FormModalProps) => {
  const formRef = useRef<FormRef>(null)
  const modal = useModal()
  const translate = useTranslate()
  const [loading, setLoading] = useState(false)

  const onSubmitFun = async (e: SubmitContext) => {
    await onSubmit?.(e)
    if (e.validateResult === true) {
      await onClose?.()
      await modal.onClose?.()
    }
  }

  return (
    <Form
      onSubmit={onSubmitFun}
      formProps={{
        labelAlign: 'top',
      }}
      ref={formRef}
      handleData={(data) => {
        setLoading(data.result?.formLoading || false)
        handleData?.(data)
      }}
      {...props}
    >
      <div className={clsx([padding ? 'p-5' : ''])}>{children}</div>
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

FormModal.displayName = 'FormModal'
