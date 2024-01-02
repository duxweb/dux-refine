import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import detector from 'i18next-browser-languagedetector'
import enUSTranslation from '../locales/en_US/common.json'
import zhCNTranslation from '../locales/zh_CN/common.json'
import zhTWTranslation from '../locales/zh_TW/common.json'
import koKRTranslation from '../locales/ko_KR/common.json'
import jaJPTranslation from '../locales/ja_JP/common.json'
import ruRUTranslation from '../locales/ru_RU/common.json'
import enUSFileManage from '../locales/en_US/file.json'
import zhCNFileManage from '../locales/zh_CN/file.json'
import zhTWFileManage from '../locales/zh_TW/file.json'
import koKRFileManage from '../locales/ko_KR/file.json'
import jaJPFileManage from '../locales/ja_JP/file.json'
import ruRUFileManage from '../locales/ru_RU/file.json'
import enUSImportManage from '../locales/en_US/import.json'
import zhCNImportManage from '../locales/zh_CN/import.json'
import zhTWImportManage from '../locales/zh_TW/import.json'
import koKRImportManage from '../locales/ko_KR/import.json'
import jaJPImportManage from '../locales/ja_JP/import.json'
import ruRUImportManage from '../locales/ru_RU/import.json'

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
        file: enUSFileManage,
        import: enUSImportManage,
      },
      'zh-CN': {
        common: zhCNTranslation,
        file: zhCNFileManage,
        import: zhCNImportManage,
      },
      'zh-TW': {
        common: zhTWTranslation,
        file: zhTWFileManage,
        import: zhTWImportManage,
      },
      'ko-KR': {
        common: koKRTranslation,
        file: koKRFileManage,
        import: koKRImportManage,
      },
      'ja-JP': {
        common: jaJPTranslation,
        file: jaJPFileManage,
        import: jaJPImportManage,
      },
      'ru-RU': {
        common: ruRUTranslation,
        file: ruRUFileManage,
        import: ruRUImportManage,
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
