import React, { useImperativeHandle } from 'react'
import {
  EnhancedTable as TdTable,
  EnhancedTableProps,
  Form,
  Card,
  PrimaryTableCol,
  Radio,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { TableRef, useTable, useTableProps } from './table'
import { BaseRecord, HttpError } from '@refinedev/core'

export interface CardTableTab {
  label: string
  value: string
  icon?: string
}

export interface CardTableProps {
  title?: React.ReactNode
  tabs?: Array<CardTableTab>
  table?: EnhancedTableProps
  columns?: PrimaryTableCol[]
  onFilterChange?: (values: Record<string, any>) => void
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  headerRender?: () => React.ReactNode
  footerRender?: () => React.ReactNode
  batchRender?: () => React.ReactNode
  filterRender?: () => React.ReactNode
}

export const CardTable = React.forwardRef(
  (
    {
      title,
      table,
      columns,
      tabs,
      tableHook,
      headerRender,
      footerRender,
      batchRender,
      filterRender,
    }: CardTableProps,
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
      ...tableHook,
    })

    const [size, sizeMap] = useWindowSize()

    const [form] = Form.useForm()

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
      <Card
        headerBordered
        header={
          <div className='flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center'>
            {selecteds && selecteds.length > 0 && batchRender ? (
              <div>{batchRender?.()}</div>
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
                  <div className='text-base'>{title}</div>
                )}
              </div>
            )}
            <div>
              <Form
                initialData={filters}
                labelWidth={0}
                className='app-filter flex-wrap'
                onValuesChange={setFilters}
                form={form}
              >
                {filterRender?.()}
              </Form>
            </div>
          </div>
        }
      >
        {headerRender?.()}

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
        {footerRender?.()}
      </Card>
    )
  }
)
CardTable.displayName = 'CardTable'
