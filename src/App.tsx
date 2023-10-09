// refine
import React, { useEffect } from 'react'
import './index.css'

// tdesign
import { ConfigProvider } from 'tdesign-react/esm'
import enUSConfig from 'tdesign-react/esm/locale/en_US'
import zhCNConfig from 'tdesign-react/esm/locale/zh_CN'
import koKRConfig from 'tdesign-react/esm/locale/ko_KR'
import jaJPConfig from 'tdesign-react/esm/locale/ja_JP'
import 'tdesign-react/esm/style/index.js'

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

  useEffect(() => {
    if (props.config.lang) {
      i18n.changeLanguage(props.config.lang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.config.lang])

  const langs: Record<string, any> = {
    'en-US': R.clone(enUSConfig),
    'zh-CN': R.clone(zhCNConfig),
    'ko-KR': R.clone(koKRConfig),
    'ja-JP': R.clone(jaJPConfig),
  }
  return (
    <React.Suspense fallback='loading'>
      <ConfigProvider globalConfig={langs[i18n.language]}>
        <AppProvider {...props} />
      </ConfigProvider>
    </React.Suspense>
  )
}
