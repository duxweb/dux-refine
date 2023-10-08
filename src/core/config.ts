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
  menu?: string
}

export interface moduleApp {
  index?: string
  register?: boolean
  forgotPassword?: boolean
  updatePassword?: boolean
}

export type siderType = 'app' | 'collapse'
export type lang = 'zh' | 'en'

export interface Config {
  projectId: string
  apiUrl: string
  apiPath: apiPath
  defaultApp: string
  resourcesPrefix: boolean
  moduleApp?: Record<string, moduleApp>
  sideType?: siderType
  appLogo?: string
  appDarkLogo?: string
  sideLogo?: string
  sideDarkLogo?: string
  loginBanner?: string
  lang?: lang
}
