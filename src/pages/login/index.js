import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useLogin, useParsed, useTranslate } from '@refinedev/core';
import { Form, Input, Button } from 'tdesign-react/esm';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react';
import { useAppStore } from '../../stores/app';
import { DuxLogo } from '../../components/logo';
const { FormItem } = Form;
export const Login = () => {
    const { mutate: login } = useLogin({});
    const [loading, setLoading] = useState();
    const switchDark = useAppStore((state) => state.switchDark);
    const { params } = useParsed();
    const translate = useTranslate();
    const onSubmit = (context) => {
        if (context.validateResult === false) {
            // error
        }
        setLoading(true);
        login({
            ...context.fields,
            app: 'admin',
        }, {
            onSuccess: () => {
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };
    return (_jsx("div", { className: 'h-screen w-screen flex items-start justify-center text-secondary md:items-center', children: _jsxs("div", { className: 'relative m-4 max-w-180 w-full flex flex-row gap-12 overflow-hidden rounded-lg p-8 shadow bg-container', children: [_jsx("div", { className: 'tex absolute h-30 w-30 flex rotate-45 cursor-pointer items-end justify-center p-3 text-white bg-brand -right-15 -top-15 hover:bg-brand-hover', onClick: () => {
                        switchDark();
                    }, children: _jsx("div", { className: 'i-tabler:sun h-5 w-5' }) }), _jsx("div", { className: 'hidden flex-1 md:block', children: _jsx("img", { src: '/public/images/login/banner.svg', className: 'h-full w-full' }) }), _jsxs("div", { className: 'flex flex-1 flex-col', children: [_jsxs("div", { className: 'mt-4 flex flex-col items-center justify-center', children: [_jsx(DuxLogo, { className: 'w-30 text-white' }), _jsx("div", { className: 'mt-4 text-lg', children: translate(`${params?.app}.title`) })] }), _jsx("div", { className: 'my-6', children: _jsxs(Form, { statusIcon: true, onSubmit: onSubmit, colon: true, labelWidth: 0, disabled: loading, children: [_jsx(FormItem, { name: 'username', children: _jsx(Input, { size: 'large', clearable: true, prefixIcon: _jsx(DesktopIcon, {}), placeholder: translate(`common.login.fields.username`) }) }), _jsx(FormItem, { name: 'password', children: _jsx(Input, { size: 'large', type: 'password', prefixIcon: _jsx(LockOnIcon, {}), clearable: true, placeholder: translate(`common.login.fields.password`), autocomplete: 'new-password' }) }), _jsx(FormItem, { children: _jsx(Button, { theme: 'primary', type: 'submit', block: true, size: 'large', loading: loading, children: translate(`common.login.buttons.submit`) }) })] }) }), _jsx("div", { className: 'text-center text-sm text-placeholder', children: translate(`admin.copyright`) })] })] }) }));
};
