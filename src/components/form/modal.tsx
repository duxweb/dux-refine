import { useCallback, useState } from 'react'
import { useResource, useTranslate } from '@refinedev/core'
import { Form as TdForm, Button, SubmitContext } from 'tdesign-react/esm'
import { Modal, useModal } from '../modal'
import { Form, FormProps, FormResult } from './form'
import clsx from 'clsx'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'

export interface FormModalProps extends FormProps {
  onClose?: () => void
  padding?: boolean
}

export const FormModal = ({
  children,
  onClose,
  onSubmit,
  onResult,
  padding = true,
  form: tdForm,
  ...props
}: FormModalProps) => {
  const modal = useModal()
  const translate = useTranslate()
  const [form] = TdForm.useForm(tdForm)
  const [result, setResult] = useState<FormResult>()
  const { resource } = useResource()
  const { name: moduleName } = useModuleContext()

  const onSubmitFun = async (e: SubmitContext) => {
    await onSubmit?.(e)
    if (e.validateResult === true) {
      await onClose?.()
      await modal.onClose?.()
    }
  }

  const onResultCallback = useCallback(
    (data: FormResult) => {
      onResult?.(data)
      setResult(data)
    },
    [onResult],
  )

  return (
    <Form
      form={form}
      onResult={onResultCallback}
      onSubmit={onSubmitFun}
      formProps={{
        labelAlign: 'top',
      }}
      {...props}
    >
      <div className={clsx([padding ? 'p-5' : ''])}>
        {children}
        <appHook.Render mark={[moduleName, resource?.name as string, 'form']} />
      </div>
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
        <Button type='submit' loading={!!result?.formLoading}>
          {translate('buttons.save')}
        </Button>
      </Modal.Footer>
    </Form>
  )
}

FormModal.displayName = 'FormModal'
