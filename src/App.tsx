// refine
import React from 'react'

// tdesign
import { ConfigProvider } from 'tdesign-react/esm'
import enConfig from 'tdesign-react/es/locale/en_US'
import zhConfig from 'tdesign-react/es/locale/zh_CN'
import 'tdesign-react/esm/style/index.js'
import './index.css'

// app
import { useAppStore } from './stores/app'
import { AppProvider, AppProviderProps } from './core/app'

// echarts
import { registerCharts } from './theme/echarts'
registerCharts()

//i18n
import './provider/i18n'
import { useTranslation } from 'react-i18next'
import * as R from 'remeda'

export const DuxApp = (props: AppProviderProps) => {
  const dark = useAppStore((state) => state.dark)
  document.documentElement.setAttribute('theme-mode', dark ? 'dark' : '')

  const { i18n } = useTranslation()
  const langs: Record<string, any> = {
    en: R.clone(enConfig),
    zh: R.clone(zhConfig),
  }
  return (
    <React.Suspense fallback='loading'>
      <ConfigProvider globalConfig={langs[i18n.language]}>
        <AppProvider {...props} />
      </ConfigProvider>
    </React.Suspense>
  )
}
