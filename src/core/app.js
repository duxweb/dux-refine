import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo } from 'react';
import { RouterProvider, createHashRouter, Navigate } from 'react-router-dom';
import { createRefine } from './package';
import { useI18nProvider } from '../provider';
const appContext = createContext({
    config: {},
});
export const useAppContext = () => {
    return useContext(appContext);
};
export const AppProvider = ({ appsData, config }) => {
    const { i18nProvider, i18n } = useI18nProvider();
    const router = useMemo(() => {
        const apps = {};
        const createApp = (name, app) => {
            apps[name] = app;
        };
        const getApp = (name) => {
            return apps[name];
        };
        const getApps = () => {
            return Object.values(apps.current);
        };
        const addI18n = (lng, ns, resources) => {
            i18n.addResourceBundle(lng, ns, resources);
        };
        appsData.map((item) => {
            item?.init?.({ createApp, getApp, getApps, addI18n });
        });
        appsData.map((item) => {
            item?.register?.({ createApp, getApp, getApps, addI18n });
        });
        appsData.map((item) => {
            item?.run?.({ createApp, getApp, getApps, addI18n });
        });
        const routes = [
            {
                index: true,
                element: _jsx(Navigate, { to: '/' + config.defaultApp }),
            },
        ];
        const formatResources = (res) => {
            return typeof res === 'string' ? ['/:app', res].join('/') : res;
        };
        Object.keys(apps).map((name) => {
            const refine = createRefine({
                name: name,
                prefix: name ? '/:app' : undefined,
                config: config,
                i18nProvider: i18nProvider,
                router: apps[name].getRouter(),
                resources: apps[name].getResources().map((item) => {
                    item.list = formatResources(item.list);
                    item.create = formatResources(item.create);
                    item.clone = formatResources(item.clone);
                    item.edit = formatResources(item.edit);
                    item.show = formatResources(item.show);
                    item.meta = {
                        ...item.meta,
                        app: name,
                    };
                    return item;
                }),
            });
            routes.push(refine);
        });
        return createHashRouter(routes);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appsData, config, i18nProvider]);
    return (_jsx(appContext.Provider, { value: {
            config: config,
        }, children: _jsx(RouterProvider, { router: router }) }));
};
