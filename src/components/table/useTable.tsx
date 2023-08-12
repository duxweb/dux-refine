import { useCallback, useMemo, useState } from 'react'
import {
  useTable as useRefineTable,
  useTableProps as useRefineTableProps,
  BaseRecord,
  HttpError,
  LogicalFilter,
  CrudSorting,
  CrudSort,
} from '@refinedev/core'
import {
  PrimaryTableCol,
  TableSort,
  SortInfo,
  SortOptions,
  SelectOptions,
  PaginationProps,
  FilterValue,
} from 'tdesign-react/esm'

export interface useTableProps<TQueryFnData, TError, TData>
  extends useRefineTableProps<TQueryFnData, TError, TData> {
  columns?: PrimaryTableCol[]
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
  loading: boolean
  refetch: () => void
}
export const useTable = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData
>({
  columns,
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

  // Pagination
  const pagination: PaginationProps = useMemo(() => {
    return {
      current,
      pageSize,
      total: tableQueryResult?.data?.total,
      onChange(pageInfo) {
        setCurrent(pageInfo.current)
        setPageSize(pageInfo.pageSize)
      },
    }
  }, [current, pageSize, setCurrent, setPageSize, tableQueryResult?.data?.total])

  // Refetch
  const refetch = useCallback(() => {
    tableQueryResult.refetch()
  }, [tableQueryResult])

  return {
    data: tableQueryResult?.data?.data || [],
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
    refetch: refetch,
  }
}
