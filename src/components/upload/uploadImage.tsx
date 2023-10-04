import { TdUploadProps, Upload as TdUpload } from 'tdesign-react/esm'
import { useUpload } from './useUpload'
import { useControllableValue } from 'ahooks'
import { useMemo } from 'react'

type UploadValue = string | string[] | undefined

interface UploadProps extends Omit<TdUploadProps, 'onChange' | 'files' | 'defaultFiles'> {
  className?: string
  value?: UploadValue
  defaultValue?: UploadValue
  onChange?: (value?: UploadValue) => void
}

export const UploadImage = ({
  className,
  value,
  defaultValue,
  onChange,
  multiple,
  ...props
}: UploadProps) => {
  const uploadParams = useUpload()
  const [state, setState] = useControllableValue<UploadValue>({ value, defaultValue, onChange })

  const files = useMemo(() => {
    if (!state) {
      return []
    }
    if (Array.isArray(state)) {
      return state.map((item) => {
        return {
          url: item,
        }
      })
    }
    return [
      {
        url: state,
      },
    ]
  }, [state])

  return (
    <TdUpload
      className={className}
      files={files}
      theme='image'
      accept='image/*'
      onChange={(value) => {
        const fileds = value?.map((item) => {
          return item.url
        })
        if (multiple) {
          setState(fileds as string[])
        } else {
          setState(fileds?.[0])
        }
      }}
      multiple={multiple}
      {...uploadParams}
      {...props}
    />
  )
}
