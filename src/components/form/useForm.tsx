import { useMemo, useEffect } from 'react'
import {
  useForm as useRefineForm,
  UseFormProps as UseRefineFormProps,
  useTranslate,
  UseFormReturnType,
} from '@refinedev/core'
import { SubmitContext, FormInstanceFunctions, FormValidateMessage } from 'tdesign-react/esm'

export interface useFormProps extends UseRefineFormProps {
  form?: FormInstanceFunctions
  initData?: Record<string, any>
  initFormat?: (data: Record<string, any>) => Record<string, any>
  saveFormat?: (data: Record<string, any>) => Record<string, any>
}

export interface useFormReturnProps extends UseFormReturnType {
  onSubmit: (e: SubmitContext) => void
  formData: Record<string, any>
}

export const useForm = (props: useFormProps): useFormReturnProps => {
  const t = useTranslate()
  const result = useRefineForm({
    onMutationError: (error, variables, context, isAutoSave) => {
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

  const getData = useMemo(() => {
    const info = props?.initData || result.queryResult?.data?.data
    if (!info) {
      return {}
    }
    return props?.initFormat?.(info) || info
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.queryResult?.data?.data])

  useEffect(() => {
    let isUnmounted = false
    if (isUnmounted) {
      return
    }
    props?.form?.setFieldsValue(getData)
    return () => {
      isUnmounted = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData])

  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      await result?.onFinish(props?.saveFormat?.(e.fields) || e.fields)
    }
  }

  return {
    ...result,
    onSubmit,
    formData: getData,
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
