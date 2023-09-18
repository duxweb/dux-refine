// refine
import React from 'react'
import './index.css'

// arco-design
import { ConfigProvider } from '@arco-design/web-react'
import enUS from '@arco-design/web-react/es/locale/en-US'
import zhCN from '@arco-design/web-react/es/locale/zh-CN'
import '@arco-design/web-react/dist/css/arco.css'

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
    en: R.clone(enUS),
    zh: R.clone(zhCN),
  }
  return (
    <React.Suspense fallback='loading'>
      <ConfigProvider locale={langs[i18n.language]}>
        <AppProvider {...props} />
      </ConfigProvider>
    </React.Suspense>
  )
}
