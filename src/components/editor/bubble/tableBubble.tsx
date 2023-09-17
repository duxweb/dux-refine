import { useEditorContext } from '../editor'
import { UIMenuItem } from '../ui/menu'
import { useTranslate } from '@refinedev/core'

export const TableBubble = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <>
      <UIMenuItem
        label={t('table.bubble.headerRow', { ns: 'editor' })}
        icon='i-tabler:table-row'
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
      />
      <UIMenuItem
        label={t('table.bubble.headerCol', { ns: 'editor' })}
        icon='i-tabler:table-column'
        onClick={() => editor.chain().focus().toggleHeaderCell().run()}
      />
      <UIMenuItem
        label={t('table.bubble.insertCol', { ns: 'editor' })}
        icon='i-tabler:table-column-insert-right'
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      />
      <UIMenuItem
        label={t('table.bubble.deleteCol', { ns: 'editor' })}
        icon='i-tabler:table-column-remove'
        onClick={() => editor.chain().focus().deleteColumn().run()}
      />
      <UIMenuItem
        label={t('table.bubble.insertRow', { ns: 'editor' })}
        icon='i-tabler:row-insert-bottom'
        onClick={() => editor.chain().focus().addRowAfter().run()}
      />
      <UIMenuItem
        label={t('table.bubble.deleteRow', { ns: 'editor' })}
        icon='i-tabler:row-remove'
        onClick={() => editor.chain().focus().deleteRow().run()}
      />

      <UIMenuItem
        label={t('table.bubble.mergeOrSplit', { ns: 'editor' })}
        icon='i-tabler:table-alias'
        onClick={() => editor.chain().focus().mergeOrSplit().run()}
      />

      <UIMenuItem
        label={t('table.bubble.delete', { ns: 'editor' })}
        icon='i-tabler:table-off'
        onClick={() => editor.chain().focus().deleteTable().run()}
      />
    </>
  )
}
