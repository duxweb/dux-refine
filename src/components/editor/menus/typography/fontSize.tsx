import { useEditorContext } from '../../editor'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const FontSizeItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  const sizeData = ['12px', '14px', '16px', '19px', '22px', '24px', '29px', '32px', '40px', '48px']

  const sizeOptions = () => {
    const data: Array<Record<string, any>> = [
      {
        content: t('fontSize.default', { ns: 'editor' }),
        active: !editor?.getAttributes('textStyle').fontSize,
      },
    ]

    sizeData.map((num) => {
      data.push({
        content: num,
        value: num,
        active: editor?.isActive('textStyle', { fontSize: num }),
      })
    })
    return data
  }

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('fontSize.name', { ns: 'editor' })}
      type='menu'
      menuOptions={sizeOptions()}
      arrow
      onMenuSelect={(item) => {
        if (!item.value) {
          editor.chain().focus().unsetFontSize().run()
          return
        }
        editor.chain().focus().setFontSize(item.value.toString()).run()
      }}
      content={
        <div className='w-15'>
          {sizeOptions().find((item) => item.active)?.content ||
            editor?.getAttributes('textStyle').fontSize}
        </div>
      }
    />
  )
}
