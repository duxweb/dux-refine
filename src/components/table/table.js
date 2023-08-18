import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useImperativeHandle } from 'react';
import { EnhancedTable as TdTable, Form, Card, Radio, } from 'tdesign-react/esm';
import { useWindowSize } from '../../core/helper';
import { useTable } from './useTable';
export const CardTable = React.forwardRef(({ title, rowKey = 'id', table, columns, header, tabs, banner, footer, batchRender, filterRender, }, ref) => {
    const { data, pagination, selecteds, setSelecteds, selectOptions, sorters, setSorters, filters, setFilters, tableFilters, setTableFilters, refetch, loading, } = useTable({
        pagination: {
            current: 0,
            pageSize: 10,
        },
        columns: columns,
    });
    const [size, sizeMap] = useWindowSize();
    useImperativeHandle(ref, () => {
        return {
            refetch: refetch,
            selecteds,
            selectOptions,
            filters,
        };
    });
    return (_jsxs(Card, { headerBordered: true, header: _jsxs("div", { className: 'flex flex-1 flex-col flex-wrap justify-between gap-2 md:flex-row md:items-center', children: [selecteds && selecteds.length > 0 && batchRender ? (_jsx("div", { children: batchRender })) : (_jsx("div", { children: tabs ? (_jsx(Radio.Group, { variant: 'default-filled', value: filters?.tab == undefined ? tabs?.[0]?.value : filters?.tab, onChange: (value) => {
                            setFilters({
                                tab: value,
                            });
                        }, children: tabs.map((item, key) => (_jsx(Radio.Button, { value: item.value, children: item.label }, key))) })) : (header || _jsx("div", { className: 'text-base', children: title })) })), _jsx("div", { children: _jsx(Form, { initialData: filters, labelWidth: 0, className: 'flex flex-col gap-2 md:flex-row', onValuesChange: setFilters, children: filterRender?.() }) })] }), children: [banner, _jsx(TdTable, { ...table, rowKey: rowKey, columns: columns, data: data, cellEmptyContent: '-', stripe: true, showSortColumnBgColor: true, loading: loading, pagination: {
                    ...pagination,
                    className: 'app-pagination',
                    theme: table?.pagination?.theme || size <= sizeMap.xl ? 'simple' : 'default',
                    showJumper: table?.pagination?.showJumper !== undefined || size <= sizeMap.xl ? false : true,
                    showPageSize: table?.pagination?.showPageSize !== undefined || size <= sizeMap.xl ? false : true,
                }, sort: sorters, onSortChange: setSorters, selectedRowKeys: selecteds, onSelectChange: setSelecteds, filterValue: tableFilters, onFilterChange: setTableFilters }), footer] }));
});
CardTable.displayName = 'CardTable';
export const FilterItem = ({ name, children }) => {
    return (_jsx(Form.FormItem, { name: name, className: 'm-0 min-w-50 p-0', children: children }));
};
