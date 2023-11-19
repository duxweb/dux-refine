import { TdUploadProps, Upload as TdUpload, UploadFile as TdUploadFile } from 'tdesign-react/esm'
import { useUpload } from './useUpload'
import { useControllableValue } from 'ahooks'
import { useMemo } from 'react'
import React from 'react'

type UploadValue = TdUploadFile | TdUploadFile[] | undefined

interface UploadProps extends Omit<TdUploadProps, 'onChange' | 'files' | 'defaultFiles'> {
  className?: string
  value?: UploadValue
  defaultValue?: UploadValue
  onChange?: (value?: UploadValue) => void
  hookProps?: TdUploadProps
}

export const UploadFile = ({
  className,
  value,
  defaultValue,
  onChange,
  multiple,
  hookProps,
  ...props
}: UploadProps) => {
  const uploadParams = useUpload(hookProps)
  const [state, setState] = useControllableValue<UploadValue>({ value, defaultValue, onChange })

  const files = useMemo(() => {
    if (!state) {
      return []
    }
    if (Array.isArray(state)) {
      return state
    }
    return [state]
  }, [state])

  return (
    <TdUpload
      className={className}
      files={files}
      theme='file'
      onChange={(value) => {
        const fileds: TdUploadFile[] = value?.map((item) => {
          return {
            url: item.url,
            name: item.name,
            size: item.size,
            uploadTime: item.uploadTime,
            status: 'success',
          }
        })
        if (multiple) {
          setState(fileds)
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
