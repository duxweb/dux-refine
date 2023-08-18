import { jsx as _jsx } from "react/jsx-runtime";
// refine
import React from 'react';
import { RefineKbarProvider } from '@refinedev/kbar';
// tdesign
import { ConfigProvider } from 'tdesign-react/esm';
import enConfig from 'tdesign-react/es/locale/en_US';
import zhConfig from 'tdesign-react/es/locale/zh_CN';
import 'tdesign-react/esm/style/index.js';
// app
import { useAppStore } from './stores/app';
import { AppProvider } from './core/app';
// echarts
import { registerCharts } from './theme/echarts';
registerCharts();
//i18n
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './provider/i18n';
export const DuxApp = (props) => {
    const dark = useAppStore((state) => state.dark);
    document.documentElement.setAttribute('theme-mode', dark ? 'dark' : '');
    return (_jsx(React.Suspense, { fallback: 'loading', children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(Comp, { ...props }) }) }));
};
const Comp = (props) => {
    const { i18n } = useTranslation();
    const langs = {
        en: enConfig,
        zh: zhConfig,
    };
    return (_jsx(ConfigProvider, { globalConfig: langs[i18n.language], children: _jsx(RefineKbarProvider, { children: _jsx(AppProvider, { ...props }) }) }));
};
