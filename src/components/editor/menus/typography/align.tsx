import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const AlignItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  const alignOptions = () => {
    return [
      {
        content: t('align.left', { ns: 'editor' }),
        value: 'left',
        prefixIcon: <div className='i-tabler:align-left'></div>,
        active: editor?.isActive({ textAlign: 'left' }),
      },
      {
        content: t('align.center', { ns: 'editor' }),
        value: 'center',
        prefixIcon: <div className='i-tabler:align-center'></div>,
        active: editor?.isActive({ textAlign: 'center' }),
      },
      {
        content: t('align.right', { ns: 'editor' }),
        value: 'right',
        prefixIcon: <div className='i-tabler:align-right'></div>,
        active: editor?.isActive({ textAlign: 'right' }),
      },
      {
        content: t('align.justify', { ns: 'editor' }),
        value: 'justify',
        prefixIcon: <div className='i-tabler:align-justified'></div>,
        active: editor?.isActive({ textAlign: 'justify' }),
      },
    ]
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <UIMenuItem
        label={t('align.name', { ns: 'editor' })}
        type='menu'
        menuOptions={alignOptions()}
        arrow
        onMenuSelect={(item) => {
          editor
            .chain()
            .focus()
            .setTextAlign(item.value as string)
            .run()
        }}
        content={
          <div className='w-15'>
            {alignOptions().find((item) => item.active)?.content ||
              t('align.justify', { ns: 'custom' })}
          </div>
        }
      />
    </>
  )
}
