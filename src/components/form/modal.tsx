import React, { useEffect } from 'react'
import { FormAction, MetaQuery, BaseKey } from '@refinedev/core'
import { Form, Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { useForm } from './useForm'

export interface FormModalProps {
  children?: React.ReactNode
  onClose?: () => void
  action?: FormAction
  id?: BaseKey
  params?: MetaQuery
}
export const FormModal = ({ children, onClose, id, params, action = 'create' }: FormModalProps) => {
  const modal = useModal()
  const [form] = Form.useForm()

  const { formLoading, onFinish, queryResult } = useForm({
    form: form,
    action: action,
    id: id,
    redirect: false,
    queryMeta: {
      params: params,
    },
  })

  const data = queryResult?.data?.data

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      await onFinish(e.fields)
      await onClose?.()
      await modal.onClose?.()
    }
  }
  return (
    <Form
      onSubmit={onSubmit}
      disabled={formLoading}
      initialData={data}
      form={form}
      labelAlign={'right'}
    >
      <div className='p-6'>{children}</div>
      <Modal.Footer>
        <Button
          variant='outline'
          onClick={() => {
            onClose?.()
            modal.onClose?.()
          }}
          disabled={formLoading}
        >
          取消
        </Button>
        <Button type='submit' loading={formLoading}>
          确定
        </Button>
      </Modal.Footer>
    </Form>
  )
}
