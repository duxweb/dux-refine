import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMenu, useGo, useParsed } from '@refinedev/core';
import clsx from 'clsx';
import { useState } from 'react';
import { Button, Link } from 'tdesign-react/esm';
import { CloseIcon } from 'tdesign-icons-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../core/app';
export const TabBar = () => {
    const { config } = useAppContext();
    const go = useGo();
    const [open, setOpen] = useState(false);
    const { params } = useParsed();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: 'h-15 flex justify-between border-t bg-container border-component md:hidden', children: [params &&
                        config.tabBar[params.app]?.map((item, index) => (_jsx(TabBarItem, { name: item.label, icon: item.icon, onClick: () => {
                                go({
                                    to: item.route,
                                });
                            } }, index))), _jsx(TabBarItem, { name: 'more', icon: 'i-tabler:dots', onClick: () => {
                            setOpen(!open);
                        } })] }), _jsx("div", { className: 'md:hidden', children: open && _jsx(Menu, { onClose: () => setOpen(false) }) })] }));
};
const Menu = ({ onClose }) => {
    const { menuItems, defaultOpenKeys } = useMenu();
    const [active, setActive] = useState(defaultOpenKeys);
    return (_jsx("div", { className: clsx([
            'fixed inset-0 z-100  items-center justify-center overflow-hidden bg-black/50 p-4',
        ]), children: _jsxs(motion.div, { className: 'h-full w-full flex flex-col rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-black/80', animate: 'show', variants: {
                show: {
                    opacity: 1,
                },
                hidden: {
                    opacity: 0,
                },
            }, children: [_jsxs("div", { className: 'flex flex-none flex-row items-center justify-between', children: [_jsx("div", { className: 'text-lg', children: "Menu" }), _jsx("div", { className: '', children: _jsx(Button, { shape: 'circle', icon: _jsx(CloseIcon, {}), variant: 'outline', onClick: onClose }) })] }), _jsx("ul", { className: 'flex flex-1 flex-col gap-2 py-4 text-sm', children: menuItems.map((item, index) => {
                        return (_jsx(CollapseMenu, { item: item, active: active, setActive: setActive, onClose: onClose }, index));
                    }) })] }) }));
};
const CollapseMenu = ({ item, active, setActive, onClose }) => {
    const [collapse, setCollapse] = useState(active[active.length - 1] == item.key);
    return (_jsxs("li", { className: clsx(['rounded bg-container']), children: [_jsx(CollapseMenuTitle, { item, collapse, setCollapse, active, setActive, onClose }), _jsx("div", { className: clsx(['p-2', item.children?.length != 0 && collapse ? 'block' : 'hidden']), children: _jsx("div", { className: 'rounded bg-gray-1 p-1', children: _jsx(CollapseMenuTree, { items: item.children, path: [item.key], active: active, setActive: setActive, onClose: onClose }) }) })] }));
};
const CollapseMenuTitle = ({ item, collapse, setCollapse, active, setActive, onClose, }) => {
    const go = useGo();
    return (_jsxs("div", { className: clsx([
            'flex cursor-pointer items-center justify-between gap-2 p-4 py-3',
            active[active.length - 1] == item.key ? 'text-brand' : '',
        ]), onClick: () => {
            item.children?.length > 0 && setCollapse(!collapse);
            if (!item.children?.length && item.route) {
                go({ to: item.route });
                setActive([item.key]);
                onClose?.();
            }
        }, children: [_jsxs("div", { className: 'flex items-center gap-2', children: [_jsx("div", { className: item.icon }), item.label] }), item.children?.length > 0 && (_jsx("div", { className: clsx([
                    'i-tabler:chevron-down transition-all',
                    collapse ? 'rotate-0' : '-rotate-90',
                ]) }))] }));
};
const CollapseMenuTree = ({ items, path, active, setActive, onClose }) => {
    const go = useGo();
    return items?.map((item, index) => (_jsx("ul", { children: _jsxs("li", { children: [_jsxs(Link, { className: clsx([
                        'block flex items-center gap-2 px-4 py-2',
                        JSON.stringify(active) === JSON.stringify([item.key, ...path]) ? 'text-brand' : '',
                    ]), hover: 'color', onClick: () => {
                        if (!item.route) {
                            return;
                        }
                        go({
                            to: item.route,
                        });
                        onClose?.();
                        setActive([item.key, ...path]);
                    }, children: [item.children?.length > 0 ? (_jsx("div", { className: 'i-tabler:caret-down-filled opacity-40' })) : (_jsx("div", { className: 'w-3' })), item.label] }), item.children?.length > 0 && (_jsx("div", { className: 'pl-4', children: _jsx(CollapseMenuTree, { items: item.children, path: [item.key, ...path], active: active, setActive: setActive, onClose: onClose }) }))] }) }, index)));
};
const TabBarItem = ({ name, icon, active, onClick }) => {
    return (_jsx(_Fragment, { children: _jsxs("div", { className: clsx([
                'flex flex-1 flex-col items-center p-2 hover:text-brand cursor-pointer',
                active ? 'text-brand' : '',
            ]), onClick: onClick, children: [_jsx("div", { className: clsx(['h-5 w-5', icon]) }), _jsx("div", { className: 'text-sm', children: name })] }) }));
};
