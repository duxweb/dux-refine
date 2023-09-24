import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { FormAction, MetaQuery, BaseKey, UseFormReturnType, RedirectAction } from '@refinedev/core'
import {
  Form as TdForm,
  SubmitContext,
  FormProps as TdFormProps,
  FormInstanceFunctions,
} from 'tdesign-react/esm'
import { useForm, useFormProps } from './useForm'

export interface FormProps {
  children?: React.ReactNode
  resource?: string
  action?: FormAction
  id?: BaseKey
  params?: MetaQuery
  initFormat?: (data: Record<string, any>) => Record<string, any>
  saveFormat?: (data: Record<string, any>) => Record<string, any>
  onSubmit?: (e: SubmitContext) => void
  useFormProps?: useFormProps
  formProps?: TdFormProps
  onData?: (form: UseFormReturnType) => void
  initData?: Record<string, any>
  redirect?: RedirectAction
}

export interface FormRef {
  form?: FormInstanceFunctions
}

export const Form = forwardRef(
  (
    {
      children,
      id,
      params,
      action,
      initFormat,
      saveFormat,
      resource,
      useFormProps,
      formProps,
      onSubmit,
      onData,
      initData,
      redirect,
    }: FormProps,
    ref: React.ForwardedRef<FormRef>
  ) => {
    const [form] = TdForm.useForm()
    useImperativeHandle(ref, () => {
      return {
        form,
      }
    })
    const formResult = useForm({
      resource: resource,
      form: form,
      action: action || id ? 'edit' : 'create',
      id: id,
      redirect: redirect,
      queryMeta: {
        params: params,
      },
      initData: initData,
      initFormat: initFormat,
      saveFormat: saveFormat,
      ...useFormProps,
    })

    const { formData, formLoading, onFinish } = formResult

    useEffect(() => {
      let isUnmounted = false
      if (isUnmounted) {
        return
      }
      onData?.(formResult)
      return () => {
        isUnmounted = true
      }
    }, [onData, formResult])

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
        {...formProps}
      >
        {children}
      </TdForm>
    )
  }
)

Form.displayName = 'Form'
