import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from 'tdesign-react/esm';
export const StatsChart = ({ name, icon, data, children }) => {
    return (_jsx(Card, { bordered: true, children: _jsxs("div", { className: 'flex flex-col gap-2', children: [_jsx("div", { className: 'text-sm', children: name }), _jsx("div", { className: 'text-3xl font-bold', children: data }), _jsx("div", { children: children })] }) }));
};
