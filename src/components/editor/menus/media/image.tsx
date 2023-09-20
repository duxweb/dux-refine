import { Message, MessagePlugin, Tabs } from 'tdesign-react/esm'
import { UIMenuItem } from '../../ui/menu'
import { UploadPopup } from './common/upload'
import { ImageUrlPopup } from './image/url'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../../editor'

export const ImageItem = () => {
  const { editor } = useEditorContext()
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
                    const img = new Image()
                    img.src = item
                    img.onerror = () => {
                      MessagePlugin.error(t('image.error', { ns: 'editor' }))
                    }
                    img.onload = () => {
                      const width = img.width
                      editor
                        .chain()
                        .focus()
                        .setImage({ src: item, width: width, height: 'auto' })
                        .run()
                    }
                  })
                }}
              />
            </Tabs.TabPanel>
            <Tabs.TabPanel value={2} label={t('image.remote', { ns: 'editor' })}>
              <ImageUrlPopup close={close} />
            </Tabs.TabPanel>
          </Tabs>
        </div>
      )}
      icon='i-tabler:photo'
    />
  )
}
