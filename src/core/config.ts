export interface userMenuItem {
  label: string
  icon: string
  route: string
}

export interface apiPath {
  login: string
  check?: string
  register?: string
  forgotPassword?: string
  updatePassword?: string
  updateProfile?: string
  upload?: string
  uploadManage?: string
  menu?: string
}

export interface moduleApp {
  index?: string
  title?: string
  register?: boolean
  forgotPassword?: boolean
  updatePassword?: boolean
  [key: string]: any
}

export type siderType = 'app' | 'collapse' | 'level'
export type lang = 'en-US' | 'zh-CN' | 'zh-TW' | 'ko-KR' | 'ja-JP' | 'ru-RU'

export interface Config {
  title?: string
  projectId: string
  apiUrl: string
  apiPath: apiPath
  defaultApp: string
  resourcesPrefix: boolean
  indexName?: string
  moduleApp?: Record<string, moduleApp>
  sideType?: siderType
  baiduMap?: string
  amapMap?: string
  appLogo?: string
  appDarkLogo?: string
  sideLogo?: string
  sideDarkLogo?: string
  loginBanner?: string
  lang?: lang
  copyright?: string
  [key: string]: any
}
