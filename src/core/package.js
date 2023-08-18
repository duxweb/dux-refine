import { jsx as _jsx } from "react/jsx-runtime";
import { Authenticated, ErrorComponent, Refine } from '@refinedev/core';
import routerBindings, { CatchAllNavigate, NavigateToResource } from '@refinedev/react-router-v6';
import { Suspense, lazy } from 'react';
import { MessagePlugin } from 'tdesign-react/esm';
import { Outlet } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { dataProvider } from '../provider/dataProvider';
import { Login } from '../pages/login';
import { Register } from '../pages/register';
import { ForgotPassword } from '../pages/forgotPassword';
import { authProvider } from '../provider/authProvider';
export const lazyComponent = (importComp) => {
    const Comp = lazy(importComp);
    return (_jsx(Suspense, { fallback: _jsx("div", { children: "loading..." }), children: _jsx(Comp, {}) }));
};
export const createRefine = ({ name, prefix, i18nProvider, router, resources, config, }) => {
    const notifyMaps = {};
    const notificationProvider = {
        open: ({ message, description, key, type, undoableTimeout }) => {
            const notifyConfig = {
                content: description || message,
                onClose: () => {
                    if (key) {
                        delete notifyMaps[key];
                    }
                },
            };
            if (type === 'success') {
                const msg = MessagePlugin.success(notifyConfig);
                if (key) {
                    notifyMaps[key] = msg;
                }
            }
            if (type === 'error') {
                const msg = MessagePlugin.error(notifyConfig);
                if (key) {
                    notifyMaps[key] = msg;
                }
            }
            if (type === 'progress') {
                const msg = MessagePlugin.warning({
                    ...notifyConfig,
                    duration: undoableTimeout,
                });
                if (key) {
                    notifyMaps[key] = msg;
                }
            }
        },
        close: (key) => {
            if (Object.prototype.hasOwnProperty.call(notifyMaps, key)) {
                MessagePlugin.close(notifyMaps[key]);
            }
        },
    };
    return {
        path: prefix,
        element: (_jsx(Refine, { dataProvider: dataProvider(name, config), authProvider: authProvider(name, config), i18nProvider: i18nProvider, routerProvider: routerBindings, notificationProvider: notificationProvider, resources: resources, options: {
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: config.projectId,
            }, children: _jsx(Outlet, {}) })),
        children: [
            {
                element: (_jsx(Authenticated, { fallback: _jsx(CatchAllNavigate, { to: 'login' }), children: _jsx(Layout, { children: _jsx(Outlet, {}) }) })),
                children: [
                    ...router,
                    {
                        path: '*',
                        element: _jsx(ErrorComponent, {}),
                    },
                ],
            },
            {
                element: (_jsx(Authenticated, { fallback: _jsx(Outlet, {}), children: _jsx(NavigateToResource, {}) })),
                children: [
                    {
                        path: 'login',
                        element: _jsx(Login, {}),
                    },
                    {
                        path: 'register',
                        element: _jsx(Register, {}),
                    },
                    {
                        path: 'forgot-password',
                        element: _jsx(ForgotPassword, {}),
                    },
                ],
            },
        ],
    };
};
