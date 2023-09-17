import clsx from 'clsx'
import { useCurrentEditor } from '@tiptap/react'
import { Colors } from './types'
import { UIMenuItem } from '../../ui/menu'
import { Button } from 'tdesign-react/esm'
import { useTranslate } from '@refinedev/core'

export const FontColorItem = () => {
  const { editor } = useCurrentEditor()
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <UIMenuItem
      label={t('fontColor.name', { ns: 'editor' })}
      type='popup'
      active={editor?.getAttributes('textStyle').color}
      popupRender={(close) => {
        return (
          <>
            <div className='grid grid-cols-10 gap-1 py-1'>
              {Colors.map((color, index) => (
                <div
                  key={index}
                  className={clsx([
                    'tiptap-tools-colors-item',
                    editor.isActive('textStyle', { color: color })
                      ? 'tiptap-tools-colors-item-active'
                      : '',
                  ])}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run()
                    close()
                  }}
                >
                  <div
                    className='tiptap-tools-colors-black'
                    style={{
                      backgroundColor: color,
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <Button
              block
              variant='text'
              onClick={() => {
                editor.chain().focus().unsetColor().run()
                close()
              }}
            >
              {t('fontColor.clear', { ns: 'editor' })}
            </Button>
          </>
        )
      }}
      icon='i-tabler:color-picker'
    />
  )
}
