import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import {
  EnhancedTable as TdTable,
  Form,
  PrimaryTableCol,
  FormInstanceFunctions,
  EnhancedTableProps,
} from 'tdesign-react/esm'
import { useWindowSize } from '../../core'
import { TableRef, useTable, useTableProps } from './useTable'
import { useResource, BaseRecord, HttpError } from '@refinedev/core'
import { appHook } from '../../utils'
import { useModuleContext } from '../../core'

export interface TableProps {
  title?: React.ReactNode
  table?: EnhancedTableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  headerRender?: () => React.ReactElement
  footerRender?: () => React.ReactElement
  batchRender?: () => React.ReactElement
  filterForm?: FormInstanceFunctions
}

export const Table = forwardRef(
  (
    { table, columns, headerRender, footerRender, batchRender, tableHook, filterForm }: TableProps,
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
      syncWithLocation: false,
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
      <div>
        {headerRender?.()}

        {selecteds && selecteds.length > 0 && (
          <div className='md:flex gap-2 items-center mb-4'>{batchRender?.()}</div>
        )}

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
        {footerRender?.()}
      </div>
    )
  },
)

Table.displayName = 'Table'
