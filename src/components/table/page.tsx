import React, { forwardRef, useImperativeHandle } from 'react'
import {
  EnhancedTable as TdTable,
  EnhancedTableProps,
  Form,
  Card,
  PrimaryTableCol,
  Radio,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, TableTab, useTable } from './table'
import { Main } from '../main'
import { useResource, useTranslate } from '@refinedev/core'

export interface PageTableProps {
  title?: React.ReactNode
  tabs?: Array<TableTab>
  table?: EnhancedTableProps
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
    }: PageTableProps,
    ref: React.ForwardedRef<TableRef>
  ) => {
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
      columns: columns,
      rowKey: table?.rowKey,
    })

    const [size, sizeMap] = useWindowSize()

    useImperativeHandle(ref, () => {
      return {
        refetch: refetch,
        selecteds,
        selectOptions,
        filters,
      }
    })
    const { resource } = useResource()
    const translate = useTranslate()
    return (
      <Main
        title={title || translate(`${resource?.meta?.label}.name`)}
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
        actions={actionRender?.()}
      >
        {headerRender?.()}

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
                  className='flex flex-col gap-2 md:flex-row'
                  onValuesChange={setFilters}
                >
                  {filterRender?.()}
                </Form>
                <div>{selecteds && selecteds.length > 0 && batchRender?.()}</div>
              </div>
            )
          }
        >
          <TdTable
            rowKey={table?.rowKey || 'id'}
            columns={columns}
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
      </Main>
    )
  }
)

PageTable.displayName = 'PageTable'
