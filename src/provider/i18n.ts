import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import enUSTranslation from '../locales/en_US/common.json'
import zhCNTranslation from '../locales/zh_CN/common.json'
import zhTWTranslation from '../locales/zh_TW/common.json'
import koKRTranslation from '../locales/ko_KR/common.json'
import jaJPTranslation from '../locales/ja_JP/common.json'
import ruRUTranslation from '../locales/ru_RU/common.json'
import enUSEditor from '../locales/en_US/editor.json'
import zhCNEditor from '../locales/zh_CN/editor.json'
import zhTWEditor from '../locales/zh_TW/editor.json'
import koKREditor from '../locales/ko_KR/editor.json'
import jaJPEditor from '../locales/ja_JP/editor.json'
import ruRUEditor from '../locales/ru_RU/editor.json'

let storedLang = localStorage.getItem('i18nextLng')

if (!storedLang) {
  const userLanguage = navigator.language
  localStorage.setItem('i18nextLng', userLanguage)
  storedLang = userLanguage
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en-US', 'zh-CN', 'zh-TW', 'ko-KR', 'ja-JP', 'ru-RU'],
    resources: {
      'en-US': {
        common: enUSTranslation,
        editor: enUSEditor,
      },
      'zh-CN': {
        common: zhCNTranslation,
        editor: zhCNEditor,
      },
      'zh-TW': {
        common: zhTWTranslation,
        editor: zhTWEditor,
      },
      'ko-KR': {
        common: koKRTranslation,
        editor: koKREditor,
      },
      'ja-JP': {
        common: jaJPTranslation,
        editor: jaJPEditor,
      },
      'ru-RU': {
        common: ruRUTranslation,
        editor: ruRUEditor,
      },
    },
    ns: ['common'],
    defaultNS: 'common',
    lng: storedLang,
    fallbackLng: ['en-US'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
