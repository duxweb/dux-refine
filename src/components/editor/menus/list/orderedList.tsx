import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const OrderedListItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('orderedList.name', { ns: 'editor' })}
      type='button'
      active={editor.isActive('orderedList')}
      onClick={() => {
        editor.chain().focus().toggleOrderedList().run()
      }}
      icon='i-tabler:list-numbers'
    />
  )
}
