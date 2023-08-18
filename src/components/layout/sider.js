import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { Tooltip } from 'tdesign-react/esm';
import { useMenu, useGo, useLogout, useTranslate } from '@refinedev/core';
import { useMemo, useState } from 'react';
import { DuxLogo } from '../logo';
const Sider = () => {
    const { menuItems, defaultOpenKeys } = useMenu();
    const { mutate: logout } = useLogout();
    const go = useGo();
    const [active, setActive] = useState(defaultOpenKeys.length > 0 ? defaultOpenKeys : ['/index']);
    const [collapse, setCollapse] = useState(true);
    const menuInfo = useMemo(() => {
        return menuItems.find((item) => active[active.length - 1] == item.key);
    }, [active, menuItems]);
    const translate = useTranslate();
    return (_jsxs("div", { className: 'z-1 hidden flex-none flex-row md:flex', children: [_jsxs("div", { className: 'h-screen w-18 flex flex-col border-r bg-container border-component', children: [_jsx("div", { className: 'h-16 flex items-center justify-center gap-2', children: _jsx(DuxLogo, { className: 'w-12' }) }), _jsx("ul", { className: 'mt-6 flex flex-1 flex-col items-center gap-3 p-2 text-secondary', children: menuItems.map((item) => {
                            return (_jsx(MenuApp, { name: translate(`${item.name}.name`) || item?.label, icon: item.icon, active: active[active.length - 1] == item.key, onClick: () => {
                                    if (active[active.length - 1] !== item.key) {
                                        setActive([item.key]);
                                        setCollapse(true);
                                    }
                                    else {
                                        setCollapse((status) => !status);
                                    }
                                    if (item.route) {
                                        go({
                                            to: item.route,
                                        });
                                    }
                                } }, item.name));
                        }) }), _jsx("div", { className: 'mb-2 flex flex-none', children: _jsx("ul", { className: 'flex flex-1 flex-col items-center gap-3 p-2 text-secondary', children: _jsx(MenuApp, { name: 'Logout', icon: 'i-tabler:logout-2', onClick: () => {
                                    logout();
                                } }) }) })] }), menuInfo && (_jsxs("div", { className: clsx([
                    'border-component h-screen flex flex-col transition-all bg-container',
                    collapse && menuInfo?.children?.length > 0
                        ? 'w-45 opacity-100 border-r'
                        : 'w-0 opacity-0 border-none',
                ]), children: [_jsx("div", { className: 'h-14 flex items-center px-4', children: menuInfo?.meta?.element || (_jsx("div", { className: 'font-bold text-secondary', children: translate(`${menuInfo.name}.name`) || menuInfo?.label })) }), menuInfo?.children?.map((item, index) => (_jsxs("div", { className: 'flex flex-col px-2 text-sm', children: [item.children?.length == 0 && item.route && (_jsx(MenuTitle, { label: translate(`${item.name}.name`) || item?.label, icon: item?.icon, active: active[active.length - 1] == menuInfo.key &&
                                    active[active.length - 2] == item.key, onClick: () => {
                                    setActive([item.key, menuInfo.key]);
                                    go({
                                        to: item.route,
                                    });
                                } }, item.name)), item?.children?.length > 0 && (_jsx(CollapseMenu, { item: item, children: _jsx("ul", { className: 'flex flex-col', children: item.children.map((sub) => (_jsx("li", { children: _jsx("div", { className: clsx([
                                                'cursor-pointer rounded pr-2 pl-8 py-2',
                                                active[active.length - 1] == menuInfo.key &&
                                                    active[active.length - 2] == item.key &&
                                                    active[active.length - 3] == sub.key
                                                    ? 'text-brand bg-brand-1'
                                                    : 'text-secondary hover:bg-secondarycontainer',
                                            ]), onClick: () => {
                                                setActive([sub.key, item.key, menuInfo.key]);
                                                go({
                                                    to: sub.route,
                                                });
                                            }, children: translate(`${sub.name}.name`) || sub?.label }) }, sub.name))) }) }, item.name))] }, index)))] }))] }));
};
const MenuApp = ({ name, icon, active, onClick }) => {
    return (_jsx("li", { children: _jsx(Tooltip, { content: name, destroyOnClose: true, duration: 0, placement: 'right', showArrow: true, theme: 'default', children: _jsx("div", { className: clsx([
                    'flex items-center justify-center rounded px-2.5 py-1.5 hover:bg-brand-1 cursor-pointer',
                    active ? 'bg-brand text-white hover:bg-brand hover:text-white' : '',
                ]), onClick: onClick, children: _jsx("div", { className: clsx(['h-5 w-5', icon]) }) }) }) }));
};
const MenuTitle = ({ label, icon, active, collapse, onClick }) => {
    return (_jsxs("div", { className: clsx([
            'mb-1 flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-secondarycontainer',
            active ? 'text-brand bg-brand-1 hover:bg-brand-1' : '',
        ]), onClick: onClick, children: [_jsx("div", { className: clsx(['w-4 h-4', icon]) }), _jsx("div", { className: 'flex-1', children: label }), collapse != undefined && (_jsx("div", { className: clsx([
                    'i-tabler:chevron-down transition-all',
                    collapse ? 'rotate-0' : '-rotate-90',
                ]) }))] }));
};
const CollapseMenu = ({ item, children }) => {
    const [collapse, setCollapse] = useState(true);
    const translate = useTranslate();
    return (_jsxs("div", { children: [_jsx(MenuTitle, { label: translate(`${item.name}.name`) || item?.label, icon: item?.icon, collapse: collapse, onClick: () => {
                    setCollapse((status) => !status);
                } }), _jsx("div", { className: clsx(['transition-all overflow-hidden', collapse ? 'max-h-200' : 'max-h-0']), children: children })] }));
};
export default Sider;
