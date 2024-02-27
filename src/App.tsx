// refine
import React, { ReactNode, useEffect } from 'react'
import './index.css'

// tdesign
import { ConfigProvider } from 'tdesign-react/esm'
import enUSConfig from 'tdesign-react/esm/locale/en_US'
import zhCNConfig from 'tdesign-react/esm/locale/zh_CN'
import koKRConfig from 'tdesign-react/esm/locale/ko_KR'
import zhTWConfig from 'tdesign-react/esm/locale/zh_TW'
import ruRUConfig from 'tdesign-react/esm/locale/ru_RU'
import 'tdesign-react/esm/style/index.js'

import 'overlayscrollbars/overlayscrollbars.css'

// app
import { useAppStore } from './stores/app'

// echarts
import { registerCharts } from './theme/echarts'
registerCharts()

//i18n
import './provider/i18n'
import { useTranslation } from 'react-i18next'
import { Config } from './core'

interface DuxAppProps {
  children?: ReactNode
  config: Config
}

export const DuxApp = ({ config, children }: DuxAppProps) => {
  const dark = useAppStore((state) => state.dark)
  document.documentElement.setAttribute('theme-mode', dark ? 'dark' : '')

  const { i18n } = useTranslation()

  useEffect(() => {
    if (config.lang) {
      i18n.changeLanguage(config.lang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.lang])

  const langs: Record<string, any> = {
    'en-US': enUSConfig,
    'zh-CN': zhCNConfig,
    'zh-TW': zhTWConfig,
    'ko-KR': koKRConfig,
    'ru-RU': ruRUConfig,
  }
  return (
    <React.Suspense fallback='loading'>
      <ConfigProvider globalConfig={langs[i18n.language]}>{children}</ConfigProvider>
    </React.Suspense>
  )
}
