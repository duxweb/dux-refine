import { useMemo, useEffect, useCallback, useState } from 'react'
import {
  useForm as useRefineForm,
  UseFormProps as UseRefineFormProps,
  useTranslate,
  UseFormReturnType,
} from '@refinedev/core'
import { SubmitContext, FormInstanceFunctions, FormValidateMessage } from 'tdesign-react/esm'
import { useDeepCompareEffect } from 'ahooks'

export interface useFormProps extends UseRefineFormProps {
  form?: FormInstanceFunctions
  initData?: Record<string, any>
  initFormat?: (data: Record<string, any>) => Record<string, any>
  saveFormat?: (data: Record<string, any>) => Record<string, any>
}

export interface useFormReturnProps extends UseFormReturnType {
  onSubmit: (e: SubmitContext) => void
  formData?: Record<string, any>
}

export const useForm = (props: useFormProps): useFormReturnProps => {
  const t = useTranslate()

  const result = useRefineForm({
    onMutationError: (error, variables, context, isAutoSave) => {
      if (result?.formLoading) {
        result.formLoading = false
      }
      if (error.statusCode == 422) {
        props?.form?.setValidateMessage(convertErrorFormat(error?.data))
      }
      props?.onMutationError?.(error, variables, context, isAutoSave)
    },
    successNotification: (data, values, resource) => {
      return {
        message: t(resource + '.name'),
        description: (data as Record<string, any>)?.message || t('notifications.success'),
        type: 'success',
      }
    },
    invalidates: ['list', 'many'],
    ...props,
  })

  useDeepCompareEffect(() => {
    let isUnmounted = false
    if (isUnmounted) {
      return
    }
    if (!result.queryResult?.data) {
      return
    }

    props?.form?.setFieldsValue(result.queryResult?.data?.data)
    return () => {
      isUnmounted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.queryResult?.data?.data])

  const onSubmit = useCallback(async (e: SubmitContext) => {
    if (e.validateResult === true) {
      await result?.onFinish(props?.saveFormat?.(e.fields) || e.fields)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...result,
    onSubmit,
    formData: result.queryResult?.data?.data,
  }
}

export const convertErrorFormat = (data: Record<string, Array<string>>) => {
  const output: FormValidateMessage<any> = {}

  for (const key in data) {
    const messages = data[key]
    output[key] = messages.map((message) => ({
      type: 'error',
      message: Array.isArray(message) ? message[0] : message,
    }))
  }
  return output
}
