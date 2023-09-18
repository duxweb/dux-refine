import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const UndoItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('undo.name', { ns: 'editor' })}
      type='button'
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().chain().focus().undo().run()}
      icon='i-tabler:arrow-back-up'
    />
  )
}