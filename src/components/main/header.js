import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumb } from '../breadcrumb';
export const MainHeader = ({ children }) => {
    return (_jsxs("div", { className: 'mb-4 flex items-center justify-between', children: [_jsx(Breadcrumb, {}), _jsx("div", { children: children })] }));
};
