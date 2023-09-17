import { useCurrentEditor } from '@tiptap/react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const BulletListItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('bulletList.name', { ns: 'editor' })}
      type='button'
      active={editor.isActive('bulletList')}
      onClick={() => {
        editor.chain().focus().toggleBulletList().run()
      }}
      icon='i-tabler:list-details'
    />
  )
}
