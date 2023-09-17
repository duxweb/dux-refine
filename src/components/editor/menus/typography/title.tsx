import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const TitleItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  const options = [
    {
      content: t('title.paragraph', { ns: 'editor' }),
      value: 'paragraph',
      active: editor?.isActive('paragraph'),
    },
    {
      content: 'H1',
      value: { level: 1 },
      active: editor?.isActive({ level: 1 }),
    },
    {
      content: 'H2',
      value: { level: 2 },
      active: editor?.isActive({ level: 2 }),
    },
    {
      content: 'H3',
      value: { level: 3 },
      active: editor?.isActive({ level: 3 }),
    },
    {
      content: 'H4',
      value: { level: 4 },
      active: editor?.isActive({ level: 4 }),
    },
    {
      content: 'H5',
      value: { level: 5 },
      active: editor?.isActive({ level: 5 }),
    },
    {
      content: 'H6',
      value: { level: 6 },
      active: editor?.isActive({ level: 6 }),
    },
  ]

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('title.name', { ns: 'editor' })}
      type='menu'
      menuOptions={options}
      arrow
      onMenuSelect={(item) => {
        if (!item.value) {
          return
        }
        if (item.value == 'paragraph') {
          editor.chain().focus().setParagraph().run()
        } else {
          editor
            .chain()
            .focus()
            .toggleHeading(item.value as any)
            .run()
        }
      }}
    >
      <div className='min-w-10'>
        {options.find((item) => item.active)?.content || t('title.custom', { ns: 'editor' })}
      </div>
    </UIMenuItem>
  )
}
