import { useState } from 'react'
import { Button, Input } from 'tdesign-react/esm'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../../../editor'

interface UploadAreaProps {
  close: () => void
}
export const VideoUrlPopup = ({ close }: UploadAreaProps) => {
  const { editor } = useEditorContext()
  const [url, setUrl] = useState<string>('')
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-col gap-2 p-2 pt-4'>
      <Input
        label={t('image.url', { ns: 'editor' })}
        value={url}
        onChange={(v) => {
          setUrl(v)
        }}
      />
      <div className='mt-2 flex justify-end gap-2'>
        <Button
          theme='default'
          onClick={() => {
            close()
          }}
        >
          {t('common.cancel', { ns: 'editor' })}
        </Button>
        <Button
          onClick={() => {
            close()
            editor.chain().focus().setVideo({ src: url }).run()
          }}
        >
          {t('common.insert', { ns: 'editor' })}
        </Button>
      </div>
    </div>
  )
}
