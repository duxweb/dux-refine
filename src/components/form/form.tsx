import React, { forwardRef, useImperativeHandle } from 'react'
import { FormAction, MetaQuery, BaseKey, RedirectAction } from '@refinedev/core'
import {
  Form as TdForm,
  SubmitContext,
  FormProps as TdFormProps,
  FormInstanceFunctions,
} from 'tdesign-react/esm'
import { useForm, useFormProps, useFormReturnProps } from './useForm'

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
  form?: FormInstanceFunctions
}

export interface FormRef {
  result?: useFormReturnProps
}

export const Form = forwardRef(
  (
    {
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
    }: FormProps,
    ref: React.ForwardedRef<FormRef>
  ) => {
    const { meta, ...formParams } = useFormProps || {}

    const formResult = useForm({
      resource: resource,
      form: form,
      action: action || id ? 'edit' : 'create',
      id: id,
      //liveMode: 'manual',
      redirect: redirect,
      meta: {
        ...(meta || {}),
        params: queryParams,
      },
      initData: initData,
      initFormat: initFormat,
      saveFormat: saveFormat,
      ...formParams,
    })

    useImperativeHandle(
      ref,
      () => {
        return {
          result: formResult,
        }
      },
      [formResult]
    )

    const { formData, formLoading } = formResult

    const onSubmitFun = async (e: SubmitContext) => {
      await formResult.onSubmit(e)
      await onSubmit?.(e)
    }

    return (
      <TdForm
        onSubmit={onSubmitFun}
        disabled={formLoading}
        initialData={formData}
        form={form}
        preventSubmitDefault={true}
        {...formProps}
      >
        {children}
      </TdForm>
    )
  }
)

Form.displayName = 'Form'
