import { useCurrentEditor } from '@tiptap/react'
import { Button, InputNumber } from 'tdesign-react/esm'
import { useState } from 'react'
import { UIMenuItem } from '../../ui/menu'
import { useTranslate } from '@refinedev/core'

export const TableItem = () => {
  const { editor } = useCurrentEditor()
  const [data, setData] = useState<Record<string, any>>({
    row: 4,
    col: 4,
  })
  const t = useTranslate()

  if (!editor) {
    return null
  }

  return (
    <>
      <UIMenuItem
        label={t('table.name', { ns: 'editor' })}
        type='popup'
        popupRender={(close) => (
          <div className='flex flex-col gap-2 p-2'>
            <InputNumber
              theme='normal'
              align='right'
              label={t('table.row', { ns: 'editor' })}
              value={data?.row}
              onChange={(v) => {
                setData({ ...data, row: v })
              }}
            />
            <InputNumber
              theme='normal'
              align='right'
              label={t('table.col', { ns: 'editor' })}
              value={data?.col}
              onChange={(v) => {
                setData({ ...data, col: v })
              }}
            />
            <Button
              shape='rectangle'
              size='medium'
              type='button'
              variant='base'
              block
              onClick={() => {
                close()
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: data.row, cols: data.col, withHeaderRow: true })
                  .run()
              }}
            >
              {t('common.confirm', { ns: 'editor' })}
            </Button>
          </div>
        )}
        icon='i-tabler:table'
      />
    </>
  )
}
