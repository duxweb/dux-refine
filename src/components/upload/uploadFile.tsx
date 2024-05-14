import {
  TdUploadProps,
  Upload as TdUpload,
  UploadFile as TdUploadFile,
  RequestMethodResponse,
  Link,
  Button,
  Progress,
  StatusEnum,
} from 'tdesign-react/esm'
import { humanFileSize, useUpload } from './useUpload'
import { useControllableValue } from 'ahooks'
import { useCallback, useMemo, useRef, useState } from 'react'
import * as qiniu from 'qiniu-js'
import { useClient } from '../../provider'
import { UploadRef } from 'tdesign-react/esm/upload/interface'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { useTranslate } from '@refinedev/core'

type UploadValue = TdUploadFile | TdUploadFile[] | undefined

interface UploadProps extends Omit<TdUploadProps, 'onChange' | 'files' | 'defaultFiles'> {
  className?: string
  value?: UploadValue
  defaultValue?: UploadValue
  onChange?: (value?: UploadValue) => void
  driver?: 'local' | 'qiniu'
  hookProps?: TdUploadProps
}

export const UploadFile = ({
  className,
  value,
  defaultValue,
  onChange,
  multiple,
  hookProps,
  driver,
  ...props
}: UploadProps) => {
  const translate = useTranslate()
  const uploadParams = useUpload(hookProps)
  const [state, setState] = useControllableValue<UploadValue>({ value, defaultValue, onChange })

  const { request } = useClient()
  const uploadDom = useRef<UploadRef>(null)

  const files = useMemo(() => {
    if (!state) {
      return []
    }
    if (Array.isArray(state)) {
      return state
    }
    return [state]
  }, [state])

  // qiniu
  const requestQiniuMethod = useCallback(
    (files: TdUploadFile | TdUploadFile[]): Promise<RequestMethodResponse> =>
      new Promise((resolve) => {
        let file: TdUploadFile = files
        if (Array.isArray(files)) {
          file = files[0]
        }

        const fileName = generateRandomFileName(file?.name || '')
        request('upload/qiniu', 'POST').then((res) => {
          const observable = qiniu.upload(
            file.raw as File,
            fileName,
            res?.data?.token,
            {
              fname: file.name,
            },
            {
              uphost: res?.data?.domain,
            },
          )
          observable.subscribe({
            next({ total }) {
              uploadDom.current?.uploadFilePercent({
                file,
                percent: Math.round(total?.percent) || 0,
              })
            },
            error(err) {
              resolve({
                status: 'fail',
                response: { url: '', error: err.message },
              })
            },
            complete({ key }) {
              resolve({
                status: 'success',
                response: {
                  url: res?.data?.public_url + '/' + key,
                  size: file.size,
                  name: file.name,
                },
              })
            },
          })
        })
      }),
    [request, uploadDom],
  )

  const [loading, setLoading] = useState(false)

  return (
    <TdUpload
      ref={uploadDom}
      className={clsx([className, 'w-full app-upload-file'])}
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
      onSelectChange={() => {
        setLoading(true)
      }}
      onSuccess={() => {
        setLoading(false)
      }}
      onValidate={() => {
        setLoading(false)
      }}
      onFail={() => {
        setLoading(false)
      }}
      multiple={multiple}
      {...uploadParams}
      {...props}
      requestMethod={driver == 'qiniu' ? requestQiniuMethod : undefined}
      formatResponse={driver == 'qiniu' ? undefined : uploadParams.formatResponse}
      fileListDisplay={({ files }) => {
        return (
          <div className='mt-4 flex flex-col gap-2'>
            {files.map((item, index) => (
              <div className='border rounded py-2 pl-4 pr-2 border-component' key={index}>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <div className='flex gap-2 items-center'>
                      {item.status == 'success' && (
                        <div className='bg-success text-white rounded-full flex items-center justify-center p-0.5'>
                          <div className='i-tabler:check w-2.5 h-2.5'></div>
                        </div>
                      )}
                      {item.status == 'fail' && (
                        <div className='bg-error text-white rounded-full flex items-center justify-center p-0.5'>
                          <div className='i-tabler:x w-2.5 h-2.5'></div>
                        </div>
                      )}
                      <Link href={item.url} target='_blank'>
                        {item.name}
                      </Link>
                    </div>
                    <div className='text-xs text-placeholder'>{humanFileSize(item.size || 0)}</div>
                  </div>
                  <div className='flex'>
                    {item.url && (
                      <Button
                        theme='default'
                        variant='text'
                        shape='circle'
                        icon={<div className='i-tabler:download'></div>}
                        onClick={() => {
                          window.open(item.url)
                        }}
                      ></Button>
                    )}
                    {!item.status ||
                      (item.status == 'success' && (
                        <Button
                          theme='default'
                          variant='text'
                          shape='circle'
                          icon={<div className='i-tabler:x'></div>}
                          onClick={() => {
                            if (Array.isArray(files)) {
                              const tmpFiles = [...files]
                              tmpFiles.splice(index, 1)
                              setState(tmpFiles)
                            } else {
                              setState(undefined)
                            }
                          }}
                        ></Button>
                      ))}
                  </div>
                </div>
                {item.status == 'progress' && (
                  <div>
                    <Progress
                      status={getStatus(item.status)}
                      percentage={item.percent}
                      theme='line'
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }}
    >
      <div className='w-full flex flex-col items-center rounded bg-gray-1 p-6 dark:bg-gray-12'>
        <div className=''>
          <svg
            className='h-12 w-12'
            viewBox='0 0 1024 1024'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='64'
          >
            <path
              d='M864.19 493.58c85.24 8.4 158.5 87.38 158.5 191.92 0 91.49-82.02 173.51-173.51 173.51H213.21v-0.18C-41 840.95-70 518.33 147.45 438 129.33 309.59 255.57 217.97 367.6 264.14c196.83-214.92 540.45-53.91 496.59 229.44z m0 0'
              className='fill-brand-7 dark:fill-brand-8'
            ></path>
            <path
              d='M867.22 493.94c-1.07-0.18-2.14-0.18-3.22-0.36 43.14-295.65-310.96-437.55-496.59-229.62-118.36-47.85-237.84 51.62-220.15 173.87-224.38 85.51-180.37 405.97 65.77 420.82v0.18H586.5c144.38-68.27 251.06-203.18 280.72-364.89z m0 0'
              className='fill-brand-6 dark:fill-brand-9'
            ></path>
            <path
              d='M6.29 598.47C22.55 522.89 75.97 463.02 147.45 438 129.33 309.59 255.57 217.97 367.6 264.14c0.72-0.72 1.43-1.61 1.96-2.32-53.6 166.72-191.37 295.55-363.27 336.65z m0 0'
              className='fill-brand-7 dark:fill-brand-8'
            ></path>
            <path
              d='M581.85 859.01H446.94v-221.4c-134.72 6.06-84.29-25.48-20.26-95.29 50.55-49.97 81.67-101.29 101.54-85.2 150.45 167.98 189.27 185.36 53.46 180.3V859h0.17z m0 0'
              className='fill-white/80'
            ></path>
          </svg>
        </div>
        <div className='text-placeholder mt-2'>
          {translate('fields.placeholder', {
            ns: 'file',
          })}
        </div>
        <div className='flex mt-4'>
          <Button icon={<div className='i-tabler:upload t-icon'></div>} loading={loading}>
            {translate('fields.file', {
              ns: 'file',
            })}
          </Button>
        </div>
      </div>
    </TdUpload>
  )
}

const generateRandomFileName = (name: string) => {
  const extension = name.substring(name.lastIndexOf('.'))
  const randomString =
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const fileName = randomString + extension

  return dayjs().format('YYYY-MM-DD') + '/' + fileName
}

const getStatus = (status?: string): StatusEnum | undefined => {
  switch (status) {
    case 'success':
      return 'success'
    case 'progress':
      return 'active'
    case 'waiting':
      return 'warning'
    case 'error':
      return 'error'
  }
}
