import React, { useEffect } from 'react'
import { FormAction, MetaQuery, BaseKey, useTranslate } from '@refinedev/core'
import { Form, Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { useForm } from './useForm'

export interface FormModalProps {
  children?: React.ReactNode
  onClose?: () => void
  action?: FormAction
  id?: BaseKey
  params?: MetaQuery
  initFormat?: (data: Record<string, any>) => Record<string, any>
  saveFormat?: (data: Record<string, any>) => Record<string, any>
}
export const FormModal = ({
  children,
  onClose,
  id,
  params,
  action,
  initFormat,
  saveFormat,
}: FormModalProps) => {
  const modal = useModal()
  const [form] = Form.useForm()
  const translate = useTranslate()

  const { formLoading, onFinish, queryResult } = useForm({
    form: form,
    action: action || id ? 'edit' : 'create',
    id: id,
    redirect: false,
    queryMeta: {
      params: params,
    },
  })

  const data = queryResult?.data?.data?.info

  useEffect(() => {
    if (data) {
      form.setFieldsValue(initFormat?.(data) || data)
    }
  }, [data, form, initFormat])

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      await onFinish(saveFormat?.(e.fields) || e.fields)
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
          {translate('buttons.cancel')}
        </Button>
        <Button type='submit' loading={formLoading}>
          {translate('buttons.save')}
        </Button>
      </Modal.Footer>
    </Form>
  )
}
