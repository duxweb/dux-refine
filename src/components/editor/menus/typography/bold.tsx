import { useCurrentEditor } from '@tiptap/react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const BoldItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('bold.name', { ns: 'editor' })}
      type='button'
      active={editor.isActive('bold')}
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      icon='i-tabler:bold'
    />
  )
}
