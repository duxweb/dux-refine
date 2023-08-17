// refine
import React from 'react'
import { RefineKbarProvider } from '@refinedev/kbar'

// tdesign
import { ConfigProvider } from 'tdesign-react/esm'
import enConfig from 'tdesign-react/es/locale/en_US'
import zhConfig from 'tdesign-react/es/locale/zh_CN'
import 'tdesign-react/esm/style/index.js'
import './theme/theme.css'

// app
import { useAppStore } from './stores/app'
import { AppProvider, AppProviderProps } from './core/app'

// echarts
import { registerCharts } from './theme/echarts'
registerCharts()

//i18n
import { useTranslation } from 'react-i18next'

export const DuxApp = (props: AppProviderProps) => {
  const { i18n } = useTranslation()
  const dark = useAppStore((state) => state.dark)
  document.documentElement.setAttribute('theme-mode', dark ? 'dark' : '')

  const langs: Record<string, any> = {
    en: enConfig,
    zh: zhConfig,
  }

  return (
    <ConfigProvider globalConfig={langs[i18n.language]}>
      <RefineKbarProvider>
        <AppProvider {...props} />
      </RefineKbarProvider>
    </ConfigProvider>
  )
}
