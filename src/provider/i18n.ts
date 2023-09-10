import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import enTranslation from '../locales/en/common.json'
import zhTranslation from '../locales/zh/common.json'

const userLanguage = navigator.language
const mainLanguage = userLanguage.split('-')[0]

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
    lng: mainLanguage,
    fallbackLng: ['en', 'zh'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
