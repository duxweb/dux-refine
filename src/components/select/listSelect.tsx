import { BaseRecord, HttpError, useMany, useTranslate } from '@refinedev/core'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Input, Button, Dialog, Table, TableProps, PrimaryTableCol, Form } from 'tdesign-react/esm'
import { useControllableValue } from 'ahooks'
import { Listform, ListformData } from '../data/listform'
import { FilterItem, useTable, useTableProps } from '../table/table'

type Value = (string | number)[]

interface SpecProps {
  value?: Value
  defaultValue?: Value
  onChange?: (value?: Value) => void
  options?: ListformData[]
  resource: string
  table?: TableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  tableColumns?: PrimaryTableCol[]
  filterRender?: ReactNode
  sort?: boolean
}

export const ListSelect = ({
  options,
  resource,
  table,
  tableHook,
  tableColumns,
  filterRender,
  sort,
  ...props
}: SpecProps) => {
  const translate = useTranslate()
  const [value, setValue] = useControllableValue<Value>(props)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Record<string, any>[]>([])

  const { data: list } = useMany({
    resource: resource,
    ids: value || [],
  })

  useEffect(() => {
    setData(list?.data || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  useEffect(() => {
    setValue(data.map((v) => v?.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className='w-full'>
      <div>
        <Button
          variant='outline'
          theme='primary'
          onClick={() => setOpen(true)}
          icon={<div className='t-icon i-tabler:plus'></div>}
        >
          {translate('common.select')}
        </Button>
      </div>
      <div className='mt-3'>
        <Listform
          createAction={false}
          deleteAction={true}
          value={data}
          options={options || []}
          rowKey='id'
          onChange={(values) => {
            setData(values)
          }}
          sort={sort}
        />
        <ModalSelect
          open={open}
          onClose={() => setOpen(false)}
          table={table}
          tableHook={tableHook}
          columns={tableColumns}
          resource={resource}
          filterRender={filterRender}
          onSelect={(values) => {
            setData((v) => {
              const items = v || []
              values?.forEach((el) => {
                if (!items.some((e) => e.id == el.id)) {
                  items.push(el)
                }
              })
              return [...items]
            })
          }}
        />
      </div>
    </div>
  )
}

interface ModalSelectProps {
  open?: boolean
  onClose?: () => void
  onSelect?: (value?: Record<string, any>[]) => void
  resource?: string
  table?: TableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  filterRender?: ReactNode
}

export const ModalSelect = ({
  resource,
  columns,
  table,
  tableHook,
  open,
  onClose,
  onSelect,
  filterRender,
}: ModalSelectProps) => {
  const translate = useTranslate()
  const [select, setSelect] = useState<Record<string, any>[]>([])
  return (
    <Dialog
      header={translate('common.select')}
      visible={open}
      onClose={onClose}
      className='app-modal'
      destroyOnClose
      width={800}
      onConfirm={() => {
        onSelect?.(select)
        onClose?.()
      }}
    >
      <Select
        resource={resource}
        columns={columns}
        table={table}
        tableHook={tableHook}
        filterRender={filterRender}
        onSelect={(v) => setSelect(v || [])}
      />
    </Dialog>
  )
}

interface SelectProps {
  resource?: string
  table?: TableProps
  tableHook?: useTableProps<BaseRecord, HttpError, BaseRecord>
  columns?: PrimaryTableCol[]
  onSelect?: (value?: Record<string, any>[]) => void
  filterRender?: ReactNode
}
const Select = ({ resource, columns, table, tableHook, onSelect, filterRender }: SelectProps) => {
  const translate = useTranslate()

  const getColumns = useMemo<PrimaryTableCol[]>(() => {
    if (!columns) {
      return []
    }
    return [
      {
        colKey: 'row-select',
        type: 'multiple',
        width: 50,
      },
      ...columns,
    ]
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
    loading,
  } = useTable({
    pagination: {
      current: 0,
      pageSize: 10,
    },
    columns: getColumns,
    rowKey: table?.rowKey,
    resource: resource,
    ...tableHook,
  })

  useEffect(() => {
    onSelect?.(selectOptions?.selectedRowData || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectOptions?.selectedRowData])

  return (
    <div className='flex flex-col gap-4 p-4 pb-0'>
      <Form
        initialData={filters}
        labelWidth={0}
        className='app-filter flex-wrap'
        onValuesChange={(values) => {
          setFilters(values)
        }}
      >
        <FilterItem name='keyword'>
          <Input placeholder={translate('common.placeholderKeyword')} />
        </FilterItem>
        {filterRender}
      </Form>

      <Table
        bordered
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
        }}
        sort={sorters}
        onSortChange={setSorters}
        selectedRowKeys={selecteds}
        onSelectChange={setSelecteds}
        filterValue={tableFilters}
        onFilterChange={setTableFilters}
        {...table}
      />
    </div>
  )
}
