import { useForm as useRefineForm, UseFormProps as UseRefineFormProps } from '@refinedev/core'
import { FormInstanceFunctions, FormValidateMessage } from 'tdesign-react/esm'

interface useFormProps extends UseRefineFormProps {
  form?: FormInstanceFunctions
}

export const useForm = (props: useFormProps) => {
  return useRefineForm({
    ...props,
    onMutationError(error, variables, context, isAutoSave) {
      if (error.statusCode == 422) {
        props?.form?.setValidateMessage(convertErrorFormat(error?.data))
      }
      props?.onMutationError?.(error, variables, context, isAutoSave)
    },
  })
}

export const convertErrorFormat = (data: Array<Record<string, Array<string>>>) => {
  return data.reduce((output: FormValidateMessage<any>, item) => {
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const messages = item[key]
        output[key] = messages.map((message) => ({
          type: 'error',
          message: message,
        }))
      }
    }
    return output
  }, {})
}
