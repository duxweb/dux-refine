import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Card, Skeleton } from 'tdesign-react/esm';
export const StatsCard = ({ name, icon, data, children }) => {
    const calcGrowthRate = useCallback((pre, cur) => {
        const growthRate = (cur - pre) / pre;
        let status;
        if (growthRate > 0) {
            status = 'increase';
        }
        else if (growthRate < 0) {
            status = 'decrease';
        }
        else {
            status = 'equal';
        }
        return [(!growthRate ? 0 : growthRate * 100).toFixed(2), status];
    }, []);
    const [info, setInfo] = useState();
    useEffect(() => {
        if (!data) {
            return;
        }
        const lastValue = data.slice(-1)?.[0] || 0;
        const pervValue = data.slice(-2, -1)?.[0] || 0;
        console.log(pervValue, lastValue);
        const [rate, rateStatus] = calcGrowthRate(pervValue, lastValue);
        setInfo({
            lastValue,
            pervValue,
            rate,
            rateStatus,
        });
    }, [calcGrowthRate, data]);
    return (_jsx(Card, { bordered: true, children: _jsx("div", { className: 'flex items-center', children: _jsxs("div", { className: 'flex flex-1 flex-col', children: [_jsxs("div", { className: 'flex items-center gap-2 text-primary', children: [_jsx("div", { className: clsx(['h-5 w-5', icon]) }), _jsx("div", { className: 'text-sm', children: name })] }), _jsxs("div", { className: 'my-3 flex items-center', children: [_jsxs("div", { className: 'h-9 flex flex-1 items-center gap-2', children: [_jsx("div", { className: 'text-3xl font-bold', children: !info ? (_jsx(Skeleton, { className: 'w-15', theme: 'text', children: ' ' })) : (info?.lastValue) }), info && (_jsxs(_Fragment, { children: [info?.rateStatus == 'equal' && (_jsx("div", { className: 'i-tabler:minus h-6 w-6 text-warning' })), info?.rateStatus == 'increase' && (_jsx("div", { className: 'i-tabler:trending-up h-6 w-6 text-success' })), info?.rateStatus == 'decrease' && (_jsx("div", { className: 'i-tabler:trending-down h-6 w-6 text-error' }))] }))] }), _jsx("div", { className: 'h-10 w-30 flex-none', children: children })] }), _jsxs("div", { className: 'flex gap-2', children: [(info?.rateStatus == 'equal' || !info) && _jsx("div", { className: 'text-warning', children: "0%" }), info?.rateStatus == 'increase' && _jsxs("div", { className: 'text-success', children: [info?.rate, "%"] }), info?.rateStatus == 'decrease' && _jsxs("div", { className: 'text-error', children: [info?.rate, "%"] }), _jsx("div", { className: 'text-placeholder', children: "from last month" })] })] }) }) }));
};
