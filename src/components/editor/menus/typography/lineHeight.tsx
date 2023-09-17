import { useCurrentEditor } from '@tiptap/react'
import { useMemo } from 'react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const LineHeightItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  const lineData = [1, 1.25, 1.5, 2, 2.5, 3]

  const lintHeight =
    editor?.getAttributes('heading').lineHeight || editor?.getAttributes('paragraph').lineHeight

  const lineOptions = useMemo(() => {
    const data: Array<Record<string, any>> = [
      {
        content: t('lineHeight.default', { ns: 'editor' }),
        active: !lintHeight,
      },
    ]

    lineData.map((num) => {
      data.push({
        content: num.toString(),
        value: num,
        active: editor?.isActive({ lineHeight: num }),
      })
    })
    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state.selection])

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('lineHeight.name', { ns: 'editor' })}
      type='menu'
      menuOptions={lineOptions}
      arrow
      onMenuSelect={(item) => {
        if (typeof item.value !== 'number') {
          editor.chain().focus().unsetLineHeight().run()
          return
        }
        editor.chain().focus().setLineHeight(item.value).run()
      }}
      content={
        <div className='w-15'>{lineOptions.find((item) => item.active)?.content || lintHeight}</div>
      }
    />
  )
}
