import { useCurrentEditor } from '@tiptap/react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const RedoItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('redo.name', { ns: 'editor' })}
      type='button'
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!editor.can().chain().focus().redo().run()}
      icon='i-tabler:arrow-forward-up'
    />
  )
}
