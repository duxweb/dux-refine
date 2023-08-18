import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import enTranslation from '../locales/en/common.json'
import zhTranslation from '../locales/zh/common.json'

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'zh'],
    resources: {
      en: {
        common: enTranslation,
      },
      zh: {
        common: zhTranslation,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: ['en', 'zh'],
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
