import { Button, EnhancedTable, PrimaryTableCol, PrimaryTableCellParams } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import {
  useMemo,
  createContext,
  cloneElement,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react'
import { useTranslate } from '@refinedev/core'

const context = createContext({})

export interface ListformData {
  title: string
  field: string
  width?: string | number
  component?: ReactElement
  content?: (
    cell: PrimaryTableCellParams<Record<string, any>>,
    setValue: (v: SetStateAction<Record<string, any>[]>, ...args: any[]) => void
  ) => ReactNode
}

export interface ListformProps {
  value?: Record<string, any>[]
  defaultValue?: Record<string, any>[]
  onChange?: (value: Record<string, any>[]) => void
  options: ListformData[]
  createAction?: boolean
  deleteAction?: boolean
  createCallback?: (value: Record<string, any>[]) => void
}

export const Listform = ({
  options,
  createAction = true,
  deleteAction = true,
  createCallback,
  ...props
}: ListformProps) => {
  const translate = useTranslate()
  const [value, setValue] = useControllableValue<Record<string, any>[]>(props)

  const columns = useMemo<PrimaryTableCol[]>(() => {
    const cols = options.map<PrimaryTableCol>((item) => {
      return {
        title: item.title,
        colKey: item.field,
        width: item.width,
        cell: (cell: PrimaryTableCellParams<Record<string, any>>) => {
          const { row, rowIndex } = cell
          return item.component
            ? cloneElement(item.component, {
                value: row[item.field],
                onChange: (v: any) => {
                  setValue((old) => {
                    const rows = old[rowIndex] || {}
                    rows[item.field] = v
                    return [...old]
                  })
                },
              })
            : item?.content?.(cell, setValue)
        },
      }
    })
    if (!createAction && !deleteAction) {
      return cols
    }

    cols.push({
      colKey: 'op',
      align: 'center',
      title: (
        <>
          {createAction ? (
            <Button
              shape='circle'
              theme='default'
              variant='outline'
              icon={<div className='i-tabler:plus h-4 w-4'></div>}
              onClick={() => {
                setValue((old) => {
                  const list = old || []
                  return [list, createCallback?.(list) || {}]
                })
              }}
            />
          ) : (
            translate('table.actions')
          )}
        </>
      ),
      cell: ({ rowIndex }) => {
        return (
          <>
            {deleteAction && (
              <Button
                shape='circle'
                theme='danger'
                variant='outline'
                icon={<div className='i-tabler:trash h-4 w-4'></div>}
                onClick={() => {
                  setValue((v) => {
                    v.splice(rowIndex, 1)
                    return [...v]
                  })
                }}
              />
            )}
          </>
        )
      },
      width: 70,
    })
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  return (
    <context.Provider value>
      <EnhancedTable bordered columns={columns} data={value || []} rowKey='key' />
    </context.Provider>
  )
}
