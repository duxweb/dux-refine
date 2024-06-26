import React, { useCallback, useEffect } from 'react'
import { FormAction, MetaQuery, BaseKey, RedirectAction, useInvalidate } from '@refinedev/core'
import {
  Form as TdForm,
  SubmitContext,
  FormProps as TdFormProps,
  FormInstanceFunctions,
} from 'tdesign-react/esm'
import { useForm, useFormProps } from './useForm'

export interface FormResult {
  formData?: Record<string, any>
  formLoading?: boolean
}
export interface FormProps {
  children?: React.ReactNode
  resource?: string
  action?: FormAction
  id?: BaseKey
  queryParams?: MetaQuery
  initFormat?: (data: Record<string, any>) => Record<string, any>
  saveFormat?: (data: Record<string, any>) => Record<string, any>
  onSubmit?: (e: SubmitContext) => void
  useFormProps?: useFormProps
  formProps?: TdFormProps
  initData?: Record<string, any>
  redirect?: RedirectAction
  onResult?: (data: FormResult) => void
  form?: FormInstanceFunctions
  refresh?: string
}

export const Form = ({
  children,
  id,
  queryParams,
  action,
  initFormat,
  saveFormat,
  resource,
  useFormProps,
  formProps,
  onSubmit,
  initData,
  redirect,
  form,
  onResult,
  refresh,
}: FormProps) => {
  const { meta, ...formParams } = useFormProps || {}
  const invalidateCall = useInvalidate()

  const formResult = useForm({
    resource: resource,
    form: form,
    action: action || id ? 'edit' : 'create',
    id: id,
    //liveMode: 'manual',
    redirect: redirect || false,
    meta: {
      ...(meta || {}),
      params: queryParams,
    },
    initFormat: initFormat,
    saveFormat: saveFormat,
    ...formParams,
  })

  const { formData, formLoading } = formResult

  useEffect(() => {
    onResult?.({
      formData: formData,
      formLoading: formLoading,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, formLoading])

  const onSubmitFun = useCallback(async (e: SubmitContext) => {
    await formResult.onSubmit(e)
    await onSubmit?.(e)
    if (refresh) {
      await invalidateCall({
        resource: refresh,
        invalidates: ['all'],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TdForm
      onSubmit={onSubmitFun}
      disabled={formLoading}
      initialData={initData || formData}
      form={form}
      preventSubmitDefault={true}
      {...formProps}
    >
      {children}
    </TdForm>
  )
}

Form.displayName = 'Form'
