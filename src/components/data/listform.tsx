import { Button, EnhancedTable, PrimaryTableCol } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import { useMemo, createContext, cloneElement, ReactElement } from 'react'

const context = createContext({})

export interface ListformData {
  title: string
  field: string
  width?: string | number
  component: ReactElement
}

export interface ListformProps {
  value?: Record<string, any>[]
  defaultValue?: Record<string, any>[]
  onChange?: (value: Record<string, any>[]) => void
  options: ListformData[]
}

export const Listform = ({ options, ...props }: ListformProps) => {
  const [value, setValue] = useControllableValue<Record<string, any>[]>(props)

  const columns = useMemo<PrimaryTableCol[]>(() => {
    const cols = options.map<PrimaryTableCol>((item) => {
      return {
        title: item.title,
        colKey: item.field,
        width: item.width,
        cell: ({ row, rowIndex }) => {
          return cloneElement(item.component, {
            value: row[item.field],
            onChange: (v: any) => {
              setValue((old) => {
                const rows = old[rowIndex] || {}
                rows[item.field] = v
                return [...old]
              })
            },
          })
        },
      }
    })
    cols.push({
      colKey: 'op',
      align: 'center',
      title: (
        <Button
          shape='circle'
          theme='default'
          variant='outline'
          icon={<div className='i-tabler:plus h-4 w-4'></div>}
          onClick={() => {
            setValue((old) => {
              return [...(old || []), {}]
            })
          }}
        />
      ),
      cell: ({ rowIndex }) => {
        return (
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
