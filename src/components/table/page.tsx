import React, {
  createContext,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  EnhancedTable as TdTable,
  EnhancedTableProps,
  Form,
  PrimaryTableCol,
  Radio,
  FormInstanceFunctions,
  SelectOptions,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable, useTableProps, useTableReturnType } from './table'
import { Main } from '../main'
import { useResource, BaseRecord, HttpError } from '@refinedev/core'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'
import { EmptyWidget } from '../status'
import { Card } from '../card/card'

export interface PageTableRenderProps {
  filters?: Record<string, any>
  selecteds?: Array<string | number>
  selectOptions?: SelectOptions<BaseRecord>
}

export interface PageTableProps {
  title?: React.ReactNode
  tabs?: Array<TableTab>
  table?: EnhancedTableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  siderRender?: (params: PageTableRenderProps) => React.ReactElement
  headerRender?: (params: PageTableRenderProps) => React.ReactElement
  footerRender?: (params: PageTableRenderProps) => React.ReactElement
  actionRender?: (params: PageTableRenderProps) => React.ReactElement
  filterRender?: (params: PageTableRenderProps) => React.ReactElement
  batchRender?: (params: PageTableRenderProps) => React.ReactElement
  filterForm?: FormInstanceFunctions
  onData?: (data?: Record<string, any>[]) => void
}

export const pageTableContext = createContext<useTableReturnType<any>>({} as any)

export const PageTable = forwardRef(
  (
    {
      title,
      tabs,
      columns,
      table,
      headerRender,
      footerRender,
      siderRender,
      filterRender,
      actionRender,
      batchRender,
      tableHook,
      filterForm,
      onData,
    }: PageTableProps,
    ref: React.ForwardedRef<TableRef>,
  ) => {
    const [size, sizeMap] = useWindowSize()
    const [form] = Form.useForm(filterForm)
    const { resource } = useResource()
    const { name: moduleName } = useModuleContext()

    const hookColumns = appHook.useMark([moduleName, resource?.name as string, 'table', 'columns'])

    const getColumns = useMemo(() => {
      if (!columns) {
        return []
      }
      const insertIndex = columns.length - 1
      columns.splice(insertIndex, 0, ...[].concat(...hookColumns))
      return columns
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns])

    const tableResult = useTable({
      pagination: {
        current: 0,
        pageSize: 10,
      },
      columns: getColumns,
      rowKey: table?.rowKey,
      filterForm: form,
      onPagination() {
        handleResize()
      },
      onData,
      ...tableHook,
    })

    const {
      data,
      pagination,
      selecteds,
      setSelecteds,
      selectOptions,
      sorters,
      setSorters,
      filters,
      setFilters,
      tableFilters,
      setTableFilters,
      onRowEdit,
      refetch,
      loading,
    } = tableResult

    useImperativeHandle(ref, () => {
      return {
        refetch: refetch,
        selecteds,
        selectOptions,
        filters,
        setFilters,
        form,
      }
    })

    const cardRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)
    const [tableHeight, setTableHeight] = useState<number | undefined>(undefined)

    const handleResize = () => {
      const elementRect = cardRef?.current?.getBoundingClientRect()
      let height = elementRect?.top || 0
      const footer = footerRef?.current?.clientHeight || 0
      if (height) {
        height -= footer
      }
      setTableHeight(height ? window.innerHeight - 100 - height : undefined)
    }

    useEffect(() => {
      if (!cardRef?.current) {
        return
      }
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    const renderParams: PageTableRenderProps = {
      filters,
      selecteds,
      selectOptions,
    }

    return (
      <pageTableContext.Provider value={tableResult}>
        <Main
          title={title}
          header={
            tabs && (
              <Radio.Group
                variant='default-filled'
                value={filters?.tab == undefined ? tabs?.[0]?.value : filters?.tab}
                onChange={(value) => {
                  setFilters({
                    tab: value,
                  })
                }}
              >
                {tabs.map((item, key) => (
                  <Radio.Button key={key} value={item.value}>
                    {item.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )
          }
          actions={
            <>
              <appHook.Render mark={[moduleName, resource?.name as string, 'table', 'action']} />
              {actionRender?.({
                filters,
                selecteds,
                selectOptions,
              })}
            </>
          }
        >
          {headerRender?.(renderParams)}

          <appHook.Render mark={[moduleName, resource?.name as string, 'table', 'header']} />

          {size <= sizeMap.md && (
            <div className='md:hidden flex flex-col gap-2 mb-2 app-mobile-header'>
              {tabs && (
                <Radio.Group
                  variant='default-filled'
                  value={filters?.tab == undefined ? tabs?.[0]?.value : filters?.tab}
                  onChange={(value) => {
                    setFilters({
                      tab: value,
                    })
                  }}
                >
                  {tabs.map((item, key) => (
                    <Radio.Button key={key} value={item.value}>
                      {item.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
              <div>{actionRender?.(renderParams)}</div>
            </div>
          )}

          <Card>
            <div className='flex gap-6 flex-col lg:flex-row'>
              {siderRender?.(renderParams)}
              <div className='w-full lg:flex-1 lg:w-1 flex flex-col gap-4'>
                {(filterRender || (selecteds && selecteds.length > 0)) && (
                  <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
                    <Form
                      initialData={filters}
                      labelWidth={0}
                      className='app-filter flex-wrap'
                      onValuesChange={(values) => {
                        setFilters(values)
                      }}
                      form={form}
                    >
                      {filterRender?.(renderParams)}
                      <appHook.Render
                        mark={[moduleName, resource?.name as string, 'table', 'filter']}
                      />
                    </Form>
                  </div>
                )}

                <div ref={cardRef}>
                  <TdTable
                    rowKey={table?.rowKey || 'id'}
                    columns={getColumns}
                    data={data}
                    cellEmptyContent={'-'}
                    showSortColumnBgColor={true}
                    loading={loading}
                    empty={<EmptyWidget />}
                    pagination={{
                      ...pagination,
                      totalContent:
                        selecteds && selecteds.length > 0 ? (
                          <div>
                            {batchRender?.(renderParams)}
                            <appHook.Render
                              mark={[moduleName, resource?.name as string, 'table', 'batch']}
                            />
                          </div>
                        ) : (
                          true
                        ),
                      className: 'app-pagination',
                      theme:
                        (selecteds && selecteds.length > 0) || size <= sizeMap.xl
                          ? 'simple'
                          : table?.pagination?.theme || 'default',
                      showJumper:
                        table?.pagination?.showJumper !== undefined || size <= sizeMap.xl
                          ? false
                          : true,
                      showPageSize:
                        table?.pagination?.showPageSize !== undefined || size <= sizeMap.xl
                          ? false
                          : true,
                    }}
                    sort={sorters}
                    onSortChange={setSorters}
                    selectedRowKeys={selecteds}
                    onSelectChange={setSelecteds}
                    filterValue={tableFilters}
                    onFilterChange={setTableFilters}
                    onRowEdit={onRowEdit}
                    maxHeight={tableHeight}
                    {...table}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div ref={footerRef}>
            {footerRender?.(renderParams)}
            <appHook.Render mark={[moduleName, resource?.name as string, 'table', 'footer']} />
          </div>
        </Main>
      </pageTableContext.Provider>
    )
  },
)

PageTable.displayName = 'PageTable'
