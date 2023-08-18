import { useCallback, useMemo, useState } from 'react';
import { useTable as useRefineTable, } from '@refinedev/core';
export const useTable = ({ columns, ...props }) => {
    const { tableQueryResult, current, setCurrent, pageSize, setPageSize, setSorters, sorters, filters, setFilters, } = useRefineTable(props);
    const [selecteds, setSelecteds] = useState();
    const [selectOptions, setSelectOptions] = useState();
    const formatFilter = useCallback((values) => {
        return Object.keys(values).map((key) => ({
            field: key,
            value: values[key],
        }));
    }, []);
    const formatValues = useCallback((filters) => {
        return filters.reduce((acc, item) => {
            acc[item.field] = item.value;
            return acc;
        }, {});
    }, []);
    const formatSorters = useCallback((sort) => {
        const sorters = [];
        if (!Array.isArray(sort) && sort !== undefined) {
            sorters.push(sort);
        }
        if (Array.isArray(sort) && sort !== undefined) {
            sorters.push(...sort);
        }
        return sorters.map((item) => ({
            field: item?.sortBy,
            order: item?.descending ? 'desc' : 'asc',
        }));
    }, []);
    // Selected
    const setOnSelecteds = (selectedRowKeys, options) => {
        setSelecteds(selectedRowKeys);
        setSelectOptions(options);
    };
    // Sorter
    const setOnSorters = useCallback((sort) => {
        setSorters(formatSorters(sort));
    }, [formatSorters, setSorters]);
    const getSorters = useMemo(() => {
        return sorters.map((item) => ({
            sortBy: item.field,
            descending: item.order === 'desc',
        }));
    }, [sorters]);
    // Filter
    const setOnFilters = useCallback((values) => {
        setFilters(formatFilter(values));
    }, [formatFilter, setFilters]);
    const getTableFilterFields = useMemo(() => {
        return columns
            ?.map((item) => {
            if (item.filter) {
                return item.colKey;
            }
        })
            .filter((v) => v);
    }, [columns]);
    const tableFilters = useMemo(() => {
        const filterData = filters?.filter((item) => {
            return getTableFilterFields?.includes(item.field);
        });
        return formatValues(filterData);
    }, [filters, formatValues, getTableFilterFields]);
    const setTableFilters = useCallback((values) => {
        if (Object.keys(values).length === 0) {
            const emptyFilter = getTableFilterFields?.map((item) => ({
                field: item,
                value: undefined,
            }));
            setFilters(emptyFilter);
            return;
        }
        setFilters(formatFilter(values));
    }, [formatFilter, getTableFilterFields, setFilters]);
    const getFilters = useMemo(() => {
        return formatValues(filters);
    }, [filters, formatValues]);
    // Pagination
    const pagination = useMemo(() => {
        return {
            current,
            pageSize,
            total: tableQueryResult?.data?.total,
            onChange(pageInfo) {
                setCurrent(pageInfo.current);
                setPageSize(pageInfo.pageSize);
            },
        };
    }, [current, pageSize, setCurrent, setPageSize, tableQueryResult?.data?.total]);
    // Refetch
    const refetch = useCallback(() => {
        tableQueryResult.refetch();
    }, [tableQueryResult]);
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
    };
};
