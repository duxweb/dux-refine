import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from './header';
import Sider from './sider';
import { TabBar } from './tabbar';
export const Layout = ({ children }) => {
    return (_jsxs("div", { className: 'inset-0 h-screen w-screen flex flex-row overflow-hidden', children: [_jsx(Sider, {}), _jsxs("div", { className: 'w-1 flex flex-1 flex-col', children: [_jsx(Header, {}), _jsx("div", { className: 'flex-1 overflow-auto', children: children }), _jsx(TabBar, {})] })] }));
};
