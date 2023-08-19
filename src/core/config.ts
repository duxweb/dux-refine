export interface TabBarItem {
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
}

export interface moduleApp {
  register?: boolean
  forgotPassword?: boolean
  updatePassword?: boolean
  updateProfile?: boolean
  upload?: boolean
}

export interface Config {
  projectId: string
  apiUrl: string
  apiPath: apiPath
  defaultApp: string
  resourcesPrefix: boolean
  tabBar: Record<string, Array<TabBarItem>>
  moduleApp?: Record<string, moduleApp>
}
