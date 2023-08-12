// refine
import { RefineKbarProvider } from '@refinedev/kbar'

// components
import './App.css'

// tdesign
import { ConfigProvider } from 'tdesign-react/esm'
import 'tdesign-react/esm/style/index.js'
import enConfig from 'tdesign-react/es/locale/en_US'
import zhConfig from 'tdesign-react/es/locale/zh_CN'

// app
import { useAppStore } from './stores/app'
import { AppProvider } from './core/app'

// echarts
import { registerCharts } from './theme/echarts'
import { useTranslation } from 'react-i18next'
registerCharts()

export const DuxApp = () => {
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
        <AppProvider />
      </RefineKbarProvider>
    </ConfigProvider>
  )
}
