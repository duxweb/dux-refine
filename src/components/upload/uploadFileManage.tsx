import { Button, Dialog, Link } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import { useState } from 'react'
import clsx from 'clsx'
import { useTranslate } from '@refinedev/core'
import { FileManage } from './manage'

interface FileValue {
  url: string
  size: string
  name: string
  mime: string
}

type UploadValue = FileValue | FileValue[] | undefined

export interface UploadFileManageProps {
  className?: string
  value?: UploadValue
  defaultValue?: UploadValue
  onChange?: (value?: UploadValue) => void
  multiple?: boolean
  accept?: string
}

export const UploadFileManage = ({
  className,
  value,
  defaultValue,
  onChange,
  multiple,
  accept,
}: UploadFileManageProps) => {
  const [state, setState] = useControllableValue<UploadValue>({ value, defaultValue, onChange })
  const translate = useTranslate()
  const [visible, setVisible] = useState(false)

  const data = state ? (Array.isArray(state) ? state : [state]) : undefined

  return (
    <div className={clsx(['w-full app-upload-file flex flex-col', className])}>
      <div>
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
            <Button
              icon={<div className='i-tabler:upload t-icon'></div>}
              onClick={() => setVisible(true)}
            >
              {translate('fields.file', {
                ns: 'file',
              })}
            </Button>
          </div>
        </div>
      </div>
      {data && data?.length > 0 && (
        <div className='mt-4 flex flex-col gap-2'>
          {data.map?.((item, key) => (
            <div className='border rounded py-2 pl-4 pr-2 border-component' key={key}>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col'>
                  <div>
                    <Link href={item.url} target='_blank'>
                      {item.name}
                    </Link>
                  </div>
                  <div className='text-xs text-placeholder'>{item.size}</div>
                </div>
                <div className='flex'>
                  <Button
                    theme='default'
                    variant='text'
                    shape='circle'
                    icon={<div className='i-tabler:download'></div>}
                    onClick={() => {
                      window.open(item.url)
                    }}
                  ></Button>
                  <Button
                    theme='default'
                    variant='text'
                    shape='circle'
                    icon={<div className='i-tabler:x'></div>}
                    onClick={() => {
                      const tmpFiles = [...data]
                      tmpFiles.splice(key, 1)
                      setState(tmpFiles)
                    }}
                  ></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        className='app-modal'
        width={'800px'}
        header={translate('fields.manage', {
          ns: 'file',
        })}
        visible={visible}
        destroyOnClose
        footer={false}
        onClose={() => setVisible(false)}
      >
        <FileManage
          accept={accept}
          mode={multiple ? 'multi' : 'single'}
          onClose={() => setVisible(false)}
          onChange={(data: Record<string, any>[]) => {
            const list = data.map((item: Record<string, any>) => {
              return {
                url: item.url,
                name: item.name,
                mime: item.mime,
                size: item.size,
              }
            })

            if (multiple) {
              setState((old) => {
                return [...(old as FileValue[]), ...list]
              })
            } else {
              setState(list[0])
            }
          }}
        />
      </Dialog>
    </div>
  )
}
