import { Button, Dialog, Link } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import { useState } from 'react'
import clsx from 'clsx'
import { Icon } from 'tdesign-icons-react/esm'
import { useTranslate } from '@refinedev/core'
import FileManage from './manage'

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
    <div className={clsx(['flex flex-col gap-2 w-full max-w-150', className])}>
      <div>
        <Button icon={<Icon name='upload' />} onClick={() => setVisible(true)}>
          {translate('fields.file', {
            ns: 'file',
          })}
        </Button>
      </div>
      {data && data?.length > 0 && (
        <div className='border border-component rounded flex flex-col divide-y dark:divide-gray-9 divide-gray-4'>
          {data.map?.((item, key) => (
            <div key={key} className='flex items-center gap-4 p-3 px-4'>
              <div className='text-primary flex-1'>
                <Link href={item.url} target='_block'>
                  {item.name}
                </Link>
              </div>
              <div className='text-sm text-secondary flex-none'>{item.size}</div>
              <div className='text-sm text-secondary flex-none'>
                <Button
                  shape='circle'
                  variant='text'
                  size='small'
                  onClick={() => {
                    setState((old) => {
                      if (multiple) {
                        return (old as FileValue[])?.filter((item, index) => index != key)
                      } else {
                        return undefined
                      }
                    })
                  }}
                >
                  <Icon name='close' />
                </Button>
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
