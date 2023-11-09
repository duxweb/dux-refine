import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import {
  EnhancedTable as TdTable,
  EnhancedTableProps,
  Form,
  Card,
  PrimaryTableCol,
  Radio,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable, useTableProps } from './table'
import { Main } from '../main'
import { useResource, BaseRecord, HttpError } from '@refinedev/core'
import { appHook } from '../../utils/hook'
import { useModuleContext } from '../../core'

export interface PageTableProps {
  title?: React.ReactNode
  tabs?: Array<TableTab>
  table?: EnhancedTableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  headerRender?: () => React.ReactElement
  footerRender?: () => React.ReactElement
  actionRender?: () => React.ReactElement
  filterRender?: () => React.ReactElement
  batchRender?: () => React.ReactElement
}

export const PageTable = forwardRef(
  (
    {
      title,
      tabs,
      columns,
      table,
      headerRender,
      footerRender,
      filterRender,
      actionRender,
      batchRender,
      tableHook,
    }: PageTableProps,
    ref: React.ForwardedRef<TableRef>
  ) => {
    const [size, sizeMap] = useWindowSize()
    const [form] = Form.useForm()
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
    } = useTable({
      pagination: {
        current: 0,
        pageSize: 10,
      },
      columns: getColumns,
      rowKey: table?.rowKey,
      ...tableHook,
    })

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

    return (
      <Main
        title={title}
        icon={resource?.meta?.icon}
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
            {actionRender?.()}
          </>
        }
      >
        {headerRender?.()}

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
            <div>{actionRender?.()}</div>
          </div>
        )}

        <Card
          headerBordered
          header={
            (filterRender || (selecteds && selecteds.length > 0)) && (
              <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
                <Form
                  initialData={filters}
                  labelWidth={0}
                  className='app-filter flex-wrap'
                  onValuesChange={setFilters}
                  form={form}
                >
                  {filterRender?.()}
                  <appHook.Render
                    mark={[moduleName, resource?.name as string, 'table', 'filter']}
                  />
                </Form>
                {selecteds && selecteds.length > 0 && (
                  <div>
                    {batchRender?.()}{' '}
                    <appHook.Render
                      mark={[moduleName, resource?.name as string, 'table', 'batch']}
                    />
                  </div>
                )}
              </div>
            )
          }
        >
          <TdTable
            rowKey={table?.rowKey || 'id'}
            columns={getColumns}
            data={data}
            cellEmptyContent={'-'}
            stripe
            showSortColumnBgColor={true}
            loading={loading}
            pagination={{
              ...pagination,
              className: 'app-pagination',
              theme: table?.pagination?.theme || size <= sizeMap.xl ? 'simple' : 'default',
              showJumper:
                table?.pagination?.showJumper !== undefined || size <= sizeMap.xl ? false : true,
              showPageSize:
                table?.pagination?.showPageSize !== undefined || size <= sizeMap.xl ? false : true,
            }}
            sort={sorters}
            onSortChange={setSorters}
            selectedRowKeys={selecteds}
            onSelectChange={setSelecteds}
            filterValue={tableFilters}
            onFilterChange={setTableFilters}
            onRowEdit={onRowEdit}
            {...table}
          />
        </Card>
        {footerRender?.()}
        <appHook.Render mark={[moduleName, resource?.name as string, 'table', 'footer']} />
      </Main>
    )
  }
)

PageTable.displayName = 'PageTable'
