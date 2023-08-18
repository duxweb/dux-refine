import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useSetLocale, useTranslate, useGetIdentity } from '@refinedev/core';
import { Avatar, Dropdown, Button, Radio } from 'tdesign-react/esm';
import { TranslateIcon, SearchIcon } from 'tdesign-icons-react';
import { useAppStore } from '../../stores/app';
const User = () => {
    const { data } = useGetIdentity();
    return (_jsxs(_Fragment, { children: [_jsx(Avatar, { image: 'https://tdesign.gtimg.com/site/avatar.jpg', shape: 'circle' }), _jsx("div", { className: 'flex flex-col', children: _jsx("div", { children: data?.userInfo?.nickname }) })] }));
};
const Lang = () => {
    const changeLanguage = useSetLocale();
    const options = [
        {
            value: 'en',
            content: 'English',
            prefixIcon: _jsx("div", { children: "\uD83C\uDDEC\uD83C\uDDE7" }),
        },
        {
            value: 'zh',
            content: '中文',
            prefixIcon: _jsx("div", { children: "\uD83C\uDDE8\uD83C\uDDF3" }),
        },
    ];
    return (_jsx(Dropdown, { options: options, onClick: (data) => {
            changeLanguage(data.value);
        }, children: _jsx(Button, { variant: 'text', shape: 'circle', children: _jsx(TranslateIcon, {}) }) }));
};
const Dark = () => {
    const switchDark = useAppStore((state) => state.switchDark);
    const dark = useAppStore((state) => state.dark);
    return (_jsxs(Radio.Group, { variant: 'default-filled', size: 'small', value: dark ? 'dark' : 'light', onChange: () => {
            switchDark();
        }, children: [_jsx(Radio.Button, { value: 'light', children: _jsx("div", { className: 'i-tabler:sun h-3 w-3 text-warning' }) }), _jsx(Radio.Button, { value: 'dark', children: _jsx("div", { className: 'i-tabler:moon h-3 w-3 text-primary' }) })] }));
};
const Item = ({ children }) => {
    return _jsx("div", { className: 'flex cursor-pointer items-center gap-2 px-2', children: children });
};
const Header = () => {
    const translate = useTranslate();
    return (_jsxs("div", { className: 'h-16 flex flex-none border-b px-3 bg-container border-component', children: [_jsx("div", { className: 'flex flex-1 items-center', children: _jsxs("div", { className: 'ml-6 h-8 max-w-50 w-full flex cursor-pointer border rounded px-2 text-sm transition-all bg-component border-transparent hover:border hover:bg-secondarycontainer hover:border-brand', children: [_jsxs("div", { className: 'flex flex-1 items-center text-placeholder', children: [translate('common.search'), "..."] }), _jsx("div", { className: 'flex items-center', children: _jsx(SearchIcon, { size: 16 }) })] }) }), _jsxs("div", { className: 'flex items-center justify-end', children: [_jsx(Item, { children: _jsx(Dark, {}) }), _jsx(Item, { children: _jsx(Lang, {}) }), _jsx(Item, { children: _jsx(User, {}) })] })] }));
};
export default Header;
