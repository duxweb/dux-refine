import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useResource,
  useTable as useRefineTable,
  useTableProps as useRefineTableProps,
  BaseRecord,
  HttpError,
  LogicalFilter,
  CrudSorting,
  CrudSort,
  useCustomMutation,
} from '@refinedev/core'
import {
  PrimaryTableCol,
  TableSort,
  SortInfo,
  SortOptions,
  SelectOptions,
  PaginationProps,
  FilterValue,
  PrimaryTableRowEditContext,
  NamePath,
  Form,
} from 'tdesign-react/esm'
import { InternalFormInstance } from 'tdesign-react/esm/form/hooks/interface'

export interface useTableProps<TQueryFnData, TError, TData>
  extends useRefineTableProps<TQueryFnData, TError, TData> {
  columns?: PrimaryTableCol[]
  rowKey?: string
}

export interface useTableReturnType<TData> {
  data?: Array<TData>
  filters: Record<string, any>
  setFilters: (values: Record<string, unknown>) => void
  tableFilters: FilterValue
  setTableFilters: (values: FilterValue) => void
  sorters: TableSort
  setSorters: (sort: TableSort, options: SortOptions<TData>) => void
  selecteds?: Array<string | number>
  selectOptions?: SelectOptions<TData>
  setSelecteds: (selectedRowKeys: Array<string | number>, options: SelectOptions<TData>) => void
  pagination: PaginationProps
  onRowEdit: (context: PrimaryTableRowEditContext<TData>) => void
  loading: boolean
  refetch: () => void
}
export const useTable = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData
>({
  columns,
  rowKey = 'id',
  ...props
}: useTableProps<TQueryFnData, TError, TData>): useTableReturnType<TData> => {
  const {
    tableQueryResult,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    setSorters,
    sorters,
    filters,
    setFilters,
  } = useRefineTable(props)

  const [selecteds, setSelecteds] = useState<Array<string | number>>()
  const [selectOptions, setSelectOptions] = useState<SelectOptions<TData>>()

  const formatFilter = useCallback((values: Record<string, any>) => {
    return Object.keys(values).map((key) => ({
      field: key,
      value: values[key],
    })) as LogicalFilter[]
  }, [])

  const formatValues = useCallback((filters: LogicalFilter[]) => {
    return filters.reduce<Record<string, any>>((acc, item) => {
      acc[item.field] = item.value
      return acc
    }, {})
  }, [])

  const formatSorters = useCallback((sort: TableSort): CrudSorting => {
    const sorters: Array<SortInfo> = []
    if (!Array.isArray(sort) && sort !== undefined) {
      sorters.push(sort)
    }
    if (Array.isArray(sort) && sort !== undefined) {
      sorters.push(...sort)
    }
    return sorters.map((item) => ({
      field: item?.sortBy,
      order: item?.descending ? 'desc' : 'asc',
    }))
  }, [])

  // Selected
  const setOnSelecteds = (
    selectedRowKeys: Array<string | number>,
    options: SelectOptions<TData>
  ) => {
    setSelecteds(selectedRowKeys)
    setSelectOptions(options)
  }

  // Sorter
  const setOnSorters = useCallback(
    (sort: TableSort) => {
      setSorters(formatSorters(sort))
    },
    [formatSorters, setSorters]
  )

  const getSorters = useMemo(() => {
    return sorters.map((item: CrudSort) => ({
      sortBy: item.field,
      descending: item.order === 'desc',
    }))
  }, [sorters])

  // Filter
  const setOnFilters = useCallback(
    (values: Record<string, unknown>) => {
      setFilters(formatFilter(values))
    },
    [formatFilter, setFilters]
  )

  const getTableFilterFields = useMemo(() => {
    return columns
      ?.map((item) => {
        if (item.filter) {
          return item.colKey
        }
      })
      .filter((v) => v)
  }, [columns])

  const tableFilters = useMemo(() => {
    const filterData = filters?.filter((item) => {
      return getTableFilterFields?.includes((item as LogicalFilter).field)
    })
    return formatValues(filterData as LogicalFilter[])
  }, [filters, formatValues, getTableFilterFields])

  const setTableFilters = useCallback(
    (values: Record<string, unknown>) => {
      if (Object.keys(values).length === 0) {
        const emptyFilter = getTableFilterFields?.map((item) => ({
          field: item,
          value: undefined,
        }))
        setFilters(emptyFilter as LogicalFilter[])
        return
      }
      setFilters(formatFilter(values))
    },
    [formatFilter, getTableFilterFields, setFilters]
  )

  const getFilters = useMemo(() => {
    return formatValues(filters as LogicalFilter[])
  }, [filters, formatValues])

  // Data
  const data = tableQueryResult?.data

  // Pagination
  const pagination: PaginationProps = useMemo(() => {
    return {
      current,
      pageSize,
      total: data?.total,
      onChange(pageInfo) {
        setCurrent(pageInfo.current)
        setPageSize(pageInfo.pageSize)
      },
    }
  }, [current, pageSize, setCurrent, setPageSize, data?.total])

  // edit
  const { mutate } = useCustomMutation()
  const { resource } = useResource(props?.resource)
  const onRowEdit = useCallback(
    (context: PrimaryTableRowEditContext<TData>) => {
      if (!resource?.name) {
        throw new Error('Resource name does not exist')
      }
      const id = context.row[rowKey]
      if (!id) {
        throw new Error('Row key does not exist')
      }
      if (!context.col?.colKey) {
        throw new Error('Edit colKey does not exist')
      }
      mutate({
        url: `${resource.name}/${id}`,
        method: 'patch',
        values: {
          [context.col.colKey]: context.value,
        },
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resource?.name, rowKey]
  )

  // Refetch
  const refetch = useCallback(() => {
    tableQueryResult.refetch()
  }, [tableQueryResult])

  return {
    data: data?.data || [],
    filters: getFilters,
    setFilters: setOnFilters,
    tableFilters: tableFilters,
    setTableFilters: setTableFilters,
    sorters: getSorters,
    setSorters: setOnSorters,
    selecteds: selecteds || [],
    selectOptions: selectOptions,
    setSelecteds: setOnSelecteds,
    loading: tableQueryResult?.isLoading,
    pagination: pagination,
    onRowEdit: onRowEdit,
    refetch: refetch,
  }
}

export interface TableRef {
  refetch: () => void
  selecteds?: Array<string | number>
  selectOptions?: SelectOptions<any>
  filters: Record<string, any>
  setFilters: (values: Record<string, unknown>) => void
  form?: InternalFormInstance
}

export interface TableTab {
  label: string
  value: string
  icon?: string
}

export interface FilterItemProps {
  children?: React.ReactNode
  name?: NamePath
}

export const FilterItem = ({ name, children }: FilterItemProps) => {
  return <Form.FormItem name={name}>{children}</Form.FormItem>
}
