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
  Button,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable, useTableProps, useTableReturnType } from './table'
import { Main } from '../main'
import { useResource, BaseRecord, HttpError, useTranslate } from '@refinedev/core'
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
  titleLang?: string
  tabs?: Array<TableTab>
  table?: EnhancedTableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  columnHookIndex?: number
  siderRender?: (params: PageTableRenderProps) => React.ReactElement
  headerRender?: (params: PageTableRenderProps) => React.ReactElement
  footerRender?: (params: PageTableRenderProps) => React.ReactElement
  actionRender?: (params: PageTableRenderProps) => React.ReactElement
  filterRender?: (params: PageTableRenderProps) => React.ReactElement
  filterAdvRender?: (params: PageTableRenderProps) => React.ReactElement
  batchRender?: (params: PageTableRenderProps) => React.ReactElement
  filterForm?: FormInstanceFunctions
  onData?: (data?: Record<string, any>[]) => void
}

export const pageTableContext = createContext<useTableReturnType<any>>({} as any)

export const PageTable = forwardRef(
  (
    {
      title,
      titleLang,
      tabs,
      columns,
      table,
      headerRender,
      footerRender,
      siderRender,
      filterRender,
      filterAdvRender,
      actionRender,
      batchRender,
      tableHook,
      filterForm,
      onData,
      columnHookIndex,
    }: PageTableProps,
    ref: React.ForwardedRef<TableRef>,
  ) => {
    const [size, sizeMap] = useWindowSize()
    const [form] = Form.useForm(filterForm)
    const { resource } = useResource()
    const { name: moduleName } = useModuleContext()
    const translate = useTranslate()

    const mark = [moduleName, resource?.name as string, 'table', 'columns']
    const hookColumns = appHook.useMark(mark)

    const getColumns = useMemo(() => {
      if (!columns) {
        return []
      }
      columns.splice(columnHookIndex || 2, 0, ...[].concat(...hookColumns))
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
    const [advFilter, setAdvFilter] = useState(false)

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

    const [displayColumns, setDisplayColumns] = useState<(string | number | boolean)[]>(
      (columns?.map((item) => item.colKey) as string[]) || [],
    )

    const [columnControllerVisible, setColumnControllerVisible] = useState(false)

    return (
      <pageTableContext.Provider value={tableResult}>
        <Main
          title={titleLang ? translate(titleLang) : title}
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
                      labelWidth={'auto'}
                      labelAlign='left'
                      className='flex flex-col gap-2 flex-1'
                      onSubmit={({ fields }) => {
                        setFilters(fields)
                      }}
                      form={form}
                    >
                      <div className='flex flex-col md:flex-row gap-2'>
                        <div className='app-filter flex-1 md:w-1'>
                          {filterRender?.(renderParams)}
                          <appHook.Render
                            mark={[moduleName, resource?.name as string, 'list', 'filter']}
                          />
                          <Form.FormItem>
                            <div className='flex-1 flex flex-col md:flex-row gap-2 flex-wrap'>
                              <Button
                                type='submit'
                                icon={<div className='t-icon i-tabler:search'></div>}
                                className='w-full md:w-auto'
                              >
                                {translate('buttons.query')}
                              </Button>
                              {filterAdvRender && (
                                <Button
                                  theme='primary'
                                  variant='text'
                                  className='w-full md:w-auto'
                                  suffix={<div className='t-icon i-tabler:chevrons-down'></div>}
                                  onClick={() => {
                                    setAdvFilter((v) => !v)
                                  }}
                                >
                                  {translate('buttons.adv')}
                                </Button>
                              )}
                            </div>
                          </Form.FormItem>
                        </div>
                        <div className='flex-none flex flex-col md:flex-row gap-2'>
                          <Button
                            theme='default'
                            variant='outline'
                            onClick={() => setColumnControllerVisible(true)}
                            icon={<div className='t-icon i-tabler:settings'></div>}
                          ></Button>
                          <Button
                            theme='default'
                            variant='outline'
                            onClick={() => refetch()}
                            icon={<div className='t-icon i-tabler:refresh'></div>}
                          ></Button>
                        </div>
                      </div>
                      {advFilter && filterAdvRender && (
                        <div className='app-filter'>
                          {filterAdvRender?.(renderParams)}

                          <appHook.Render
                            mark={[moduleName, resource?.name as string, 'list', 'filterAdv']}
                          />
                        </div>
                      )}
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
                    displayColumns={displayColumns}
                    onDisplayColumnsChange={setDisplayColumns}
                    columnControllerVisible={columnControllerVisible}
                    onColumnControllerVisibleChange={setColumnControllerVisible}
                    columnController={{
                      dialogProps: {
                        preventScrollThrough: true,
                        className: 'app-modal app-modal-padding',
                      },
                      hideTriggerButton: true,
                    }}
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
