import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
const useAppStore = create()(persist((set, get) => ({
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    switchDark: () => {
        document.documentElement.setAttribute('theme-mode', !get().dark ? 'dark' : '');
        set({ dark: !get().dark });
    },
}), {
    name: 'theme-mode',
    storage: createJSONStorage(() => localStorage),
}));
const useUserStore = create()(persist((set) => ({
    token: undefined,
    data: undefined,
    setUser: (token) => {
        set({ token: token });
    },
}), {
    name: 'authorization',
    storage: createJSONStorage(() => localStorage),
}));
export { useAppStore, useUserStore };
