import { useCurrentEditor } from '@tiptap/react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const CodeItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('code.name', { ns: 'editor' })}
      type='button'
      active={editor.isActive('code')}
      onClick={() => editor.chain().focus().toggleCode().run()}
      disabled={!editor.can().chain().focus().toggleCode().run()}
      icon='i-tabler:code'
    />
  )
}
