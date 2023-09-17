import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'
import { editorPageType, useEditorContext } from '../../editor'
import { DropdownOption } from 'tdesign-react/esm'

export const TypeItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()

  const { pageType, setPageType } = useEditorContext()

  const options: DropdownOption[] = [
    {
      content: t('type.web', { ns: 'editor' }),
      value: 'web',
      active: pageType === 'web',
      prefixIcon: <div className='i-tabler:device-imac'></div>,
    },
    {
      content: t('type.docs', { ns: 'editor' }),
      value: 'docs',
      active: pageType === 'docs',
      prefixIcon: <div className='i-tabler:book'></div>,
    },
    {
      content: t('type.mobile', { ns: 'editor' }),
      value: 'mobile',
      active: pageType === 'mobile',
      prefixIcon: <div className='i-tabler:device-imac'></div>,
    },
  ]

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('type.name', { ns: 'editor' })}
      type='menu'
      menuOptions={options}
      arrow
      onMenuSelect={(item) => {
        setPageType?.(item.value as editorPageType)
      }}
    >
      <div className='min-w-10'>{options.find((item) => item.active)?.content}</div>
    </UIMenuItem>
  )
}
