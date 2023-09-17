import { useCurrentEditor } from '@tiptap/react'
import { Tabs } from 'tdesign-react/esm'
import { UIMenuItem } from '../../ui/menu'
import { UploadPopup } from './common/upload'
import { ImageUrlPopup } from './image/url'
import { useTranslate } from '@refinedev/core'

export const ImageItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('image.name', { ns: 'editor' })}
      type='popup'
      active={editor.isActive('imageResize')}
      popupRender={(close) => (
        <div className='w-88'>
          <Tabs placement={'top'} size={'medium'} defaultValue={1}>
            <Tabs.TabPanel value={1} label={t('image.local', { ns: 'editor' })}>
              <UploadPopup
                accept='image/*'
                close={close}
                onConfirm={(files) => {
                  files?.map((item) => {
                    editor.chain().focus().setImage({ src: item }).run()
                  })
                }}
              />
            </Tabs.TabPanel>
            <Tabs.TabPanel value={2} label={t('image.upload', { ns: 'editor' })}>
              <ImageUrlPopup close={close} />
            </Tabs.TabPanel>
          </Tabs>
        </div>
      )}
      icon='i-tabler:photo'
    />
  )
}
