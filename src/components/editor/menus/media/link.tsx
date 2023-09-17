import { UIMenuItem } from '../../ui/menu'
import { Button, Input } from 'tdesign-react/esm'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../../editor'
import { useState } from 'react'

export const LinkItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()
  const [url, setUrl] = useState('')

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('link.name', { ns: 'editor' })}
      type='popup'
      active={editor.isActive('link')}
      popupRender={(close) => (
        <div className='flex gap-2 py-1'>
          <Input
            defaultValue={editor?.getAttributes('link').href}
            onChange={(value) => setUrl(value)}
          />
          <Button
            theme='primary'
            type='button'
            onClick={() => {
              editor.commands.setLink({ href: url, target: '_blank' })
              close()
            }}
          >
            {t('common.confirm', { ns: 'editor' })}
          </Button>
          <Button
            theme='default'
            variant='outline'
            type='button'
            onClick={() => {
              editor.commands.unsetLink()
              close()
            }}
          >
            {t('link.delete', { ns: 'editor' })}
          </Button>
        </div>
      )}
      icon='i-tabler:link'
    />
  )
}
