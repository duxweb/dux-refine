import { UIMenuItem } from '../../ui/menu'
import { Tabs } from 'tdesign-react/esm'
import { UploadPopup } from './common/upload'
import { VideoUrlPopup } from './video/url'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../../editor'

export const VideoItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('video.name', { ns: 'editor' })}
      type='popup'
      active={editor.isActive('video')}
      popupRender={(close) => (
        <div className='w-88'>
          <Tabs placement={'top'} size={'medium'} defaultValue={1}>
            <Tabs.TabPanel value={1} label={t('video.local', { ns: 'editor' })}>
              <UploadPopup
                accept='video/*'
                close={close}
                onConfirm={(files) => {
                  files?.map((item) => {
                    editor.chain().focus().setVideo({ src: item }).run()
                  })
                }}
              />
            </Tabs.TabPanel>
            <Tabs.TabPanel value={2} label={t('video.upload', { ns: 'editor' })}>
              <VideoUrlPopup close={close} />
            </Tabs.TabPanel>
          </Tabs>
        </div>
      )}
      icon='i-tabler:video'
    />
  )
}
