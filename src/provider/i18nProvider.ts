import { I18nProvider } from '@refinedev/core'
import { i18n } from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface HookI18nProvider extends React.PropsWithChildren {
  i18nProvider: I18nProvider
  i18n: i18n
}

export const useI18nProvider = (): HookI18nProvider => {
  const { i18n, t } = useTranslation()
  return {
    i18nProvider: {
      translate: (key: string, params: string) => t(key, params),
      changeLocale: (lang: string) => i18n.changeLanguage(lang),
      getLocale: () => i18n.language,
    },
    i18n: i18n,
  }
}
