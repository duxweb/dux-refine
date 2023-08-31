import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { FormAction, MetaQuery, BaseKey, UseFormReturnType } from '@refinedev/core'
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
}

export interface FormFef {
  form: FormInstanceFunctions
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
    }: FormProps,
    ref: React.ForwardedRef<FormFef>
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
      redirect: false,
      queryMeta: {
        params: params,
      },
      initData: initData,
      initFormat: initFormat,
      saveFormat: saveFormat,
      ...useFormProps,
    })

    const { formData, formLoading } = formResult

    useEffect(() => {
      onData?.(formResult)
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
