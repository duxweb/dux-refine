import { Dialog, Image, ImageViewer } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import { useState } from 'react'
import clsx from 'clsx'
import { Icon } from 'tdesign-icons-react/esm'
import { useTranslate } from '@refinedev/core'
import FileManage from './manage'

type UploadValue = string | string[] | undefined

export interface UploadImageManageProps {
  className?: string
  value?: UploadValue
  defaultValue?: UploadValue
  onChange?: (value?: UploadValue) => void
  multiple?: boolean
  accept?: string
}

export const UploadImageManage = ({
  className,
  value,
  defaultValue,
  onChange,
  multiple,
  accept,
}: UploadImageManageProps) => {
  const [state, setState] = useControllableValue<UploadValue>({ value, defaultValue, onChange })
  const translate = useTranslate()
  const [visible, setVisible] = useState(false)

  const data = state ? (Array.isArray(state) ? state : [state]) : undefined

  return (
    <div className={clsx(['flex flex-col gap-2 w-full t-upload', className])}>
      <div className='t-upload__card clearfix '>
        {data &&
          data?.length > 0 &&
          data.map?.((item, key) => (
            <ImageItem
              url={item}
              key={key}
              onRemove={() => {
                setState((old) => {
                  if (multiple) {
                    return (old as string[])?.filter((item, index) => index != key)
                  } else {
                    return undefined
                  }
                })
              }}
            />
          ))}
        {(multiple || !data || data?.length <= 0) && (
          <div className='t-upload__card-item t-is-background'>
            <div
              className='t-upload__image-add t-upload__card-container t-upload__card-box'
              onClick={() => setVisible(true)}
            >
              <Icon name='add' />
              <p className='t-size-s'>
                {translate('placeholder.image', {
                  ns: 'file',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      <Dialog
        className='app-modal w-800px'
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
              return item.url
            })

            if (multiple) {
              setState((old) => {
                return [...(old as string[]), ...list]
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

interface ImageItemProps {
  url: string
  onRemove?: () => void
}

const ImageItem = ({ url, onRemove }: ImageItemProps) => {
  return (
    <div className='t-upload__card-item'>
      <div className='t-upload__card-content t-is-bordered'>
        <ImageViewer
          trigger={({ open }) => (
            <Image
              src={url}
              className='t-upload__card-image w-full h-full'
              overlayContent={
                <div className='t-upload__card-mask'>
                  <span className='t-upload__card-mask-item'>
                    <Icon size='16px' name={'browse'} onClick={() => open()} />
                  </span>
                  <span className='t-upload__card-mask-item-divider'></span>
                  <span className='t-upload__card-mask-item t-upload__delete' onClick={onRemove}>
                    <Icon size='16px' name={'delete'} />
                  </span>
                </div>
              }
              overlayTrigger='hover'
              fit='contain'
            />
          )}
          images={[url]}
        />
      </div>
    </div>
  )
}
