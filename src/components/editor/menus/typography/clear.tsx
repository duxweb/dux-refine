import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const ClearItem = () => {
  const { editor } = useEditorContext()
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
