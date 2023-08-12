import React, { useImperativeHandle, useMemo, useState } from 'react'
import {
  EnhancedTable as TdTable,
  TableProps,
  Form,
  NamePath,
  Card,
  PrimaryTableCol,
  Radio,
  SelectOptions,
} from 'tdesign-react/esm'
import { useWindowSize } from '@/core/helper'
import { useTable } from './useTable'

export interface CardTableTab {
  label: string
  value: string
  icon?: string
}

export interface CardTableProps {
  title?: React.ReactNode
  header?: React.ReactNode
  tabs?: Array<CardTableTab>
  banner?: React.ReactNode
  footer?: React.ReactNode
  table?: TableProps
  rowKey?: string
  columns?: PrimaryTableCol[]
  filterData?: Record<string, any>
  filterRender?: () => React.ReactNode
  onFilterChange?: (values: Record<string, any>) => void
  batchRender?: React.ReactNode
}

export interface CardTableRef {
  refetch: () => void
  selecteds?: Array<string | number>
  selectOptions?: SelectOptions<any>
  filters: Record<string, any>
}

export const CardTable = React.forwardRef(
  (
    {
      title,
      rowKey = 'id',
      table,
      columns,
      header,
      tabs,
      banner,
      footer,
      batchRender,
      filterRender,
    }: CardTableProps,
    ref: React.ForwardedRef<CardTableRef>
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
      refetch,
      loading,
    } = useTable({
      pagination: {
        current: 0,
        pageSize: 10,
      },
      columns: columns,
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

    return (
      <Card
        headerBordered
        header={
          <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
            {selecteds && selecteds.length > 0 && batchRender ? (
              <div>{batchRender}</div>
            ) : (
              <div>
                {tabs ? (
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
                ) : (
                  header || <div className='text-base'>{title}</div>
                )}
              </div>
            )}
            <div>
              <Form
                initialData={filters}
                labelWidth={0}
                className='flex flex-col gap-2 md:flex-row'
                onValuesChange={setFilters}
              >
                {filterRender?.()}
              </Form>
            </div>
          </div>
        }
      >
        {banner}

        <TdTable
          {...table}
          rowKey={rowKey}
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
        />
        {footer}
      </Card>
    )
  }
)
CardTable.displayName = 'CardTable'

export interface FilterItemProps {
  children: React.ReactNode
  name: NamePath
}

export const FilterItem = ({ name, children }: FilterItemProps) => {
  return (
    <Form.FormItem name={name} className='m-0 min-w-50 p-0'>
      {children}
    </Form.FormItem>
  )
}
