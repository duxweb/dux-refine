import clsx from 'clsx'
import { Colors } from './types'
import { UIMenuItem } from '../../ui/menu'
import { Button } from 'tdesign-react/esm'
import { useTranslate } from '@refinedev/core'
import { useEditorContext } from '../../editor'

export const BgColorItem = () => {
  const { editor } = useEditorContext()
  const t = useTranslate()
  if (!editor) {
    return null
  }
  return (
    <UIMenuItem
      label={t('bgColor.name', { ns: 'editor' })}
      type='popup'
      active={editor.isActive('highlight')}
      popupRender={(close) => {
        return (
          <>
            <div className='grid grid-cols-10 gap-1 py-1'>
              {Colors.map((color, index) => (
                <div
                  key={index}
                  className={clsx([
                    'tiptap-tools-colors-item',
                    editor.isActive('highlight', { color: color })
                      ? 'tiptap-tools-colors-item-active'
                      : '',
                  ])}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: color }).run()
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
                editor.chain().focus().unsetHighlight().run()
                close()
              }}
            >
              {t('bgColor.clear', { ns: 'editor' })}
            </Button>
          </>
        )
      }}
      icon='i-tabler:palette'
    />
  )
}
