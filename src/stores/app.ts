import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  switchDark: () => void
}

const useAppStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
      switchDark: () => {
        document.documentElement.setAttribute('theme-mode', !get().dark ? 'dark' : '')
        set({ dark: !get().dark })
      },
    }),
    {
      name: 'theme-mode',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

interface UserState {
  token?: string
  data?: any
  setUser: (token: string, data?: any) => void
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: undefined,
      data: undefined,
      setUser: (token) => {
        set({ token: token })
      },
    }),
    {
      name: 'authorization',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export { useAppStore, useUserStore }
