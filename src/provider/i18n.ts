import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import enTranslation from '../locales/en/common.json'
import zhTranslation from '../locales/zh/common.json'
import enEditor from '../locales/en/editor.json'
import zhEditor from '../locales/zh/editor.json'

let storedLang = localStorage.getItem('i18nextLng')

if (!storedLang) {
  const userLanguage = navigator.language
  const mainLanguage = userLanguage.split('-')[0]
  localStorage.setItem('i18nextLng', mainLanguage)
  storedLang = mainLanguage
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'zh'],
    resources: {
      en: {
        common: enTranslation,
        editor: enEditor,
      },
      zh: {
        common: zhTranslation,
        editor: zhEditor,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
    lng: storedLang,
    fallbackLng: ['en', 'zh'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
