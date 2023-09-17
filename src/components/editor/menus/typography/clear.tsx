import { useCurrentEditor } from '@tiptap/react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const ClearItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('clear.name', { ns: 'editor' })}
      type='button'
      onClick={() => editor.chain().focus().unsetAllMarks().run()}
      icon='i-tabler:clear-formatting'
    />
  )
}
