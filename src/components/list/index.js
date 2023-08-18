import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
export const List = ({ className, children }) => {
    return _jsx("div", { className: clsx(['flex flex-col gap-4', className]), children: children });
};
const ListItem = ({ children, append }) => {
    return (_jsxs("div", { className: 'flex items-center gap-4', children: [_jsx("div", { className: 'flex-1', children: children }), _jsx("div", { className: 'flex-none', children: append })] }));
};
List.Item = ListItem;
