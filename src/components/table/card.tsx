import React, { useImperativeHandle } from 'react'
import {
  EnhancedTable as TdTable,
  EnhancedTableProps,
  Form,
  Card,
  PrimaryTableCol,
  Radio,
  SelectOptions,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core/helper'
import { useTable } from './table'

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
  headerRender?: () => React.ReactNode
  footerRender?: () => React.ReactNode
  batchRender?: () => React.ReactNode
  filterRender?: () => React.ReactNode
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
      table,
      columns,
      tabs,
      headerRender,
      footerRender,
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
                className='flex flex-col gap-2 md:flex-row'
                onValuesChange={setFilters}
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
