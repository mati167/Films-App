import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
    mode: 'light' | 'dark'
    toggleMode: () => void
}

const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            mode: 'dark', // Initial mode
            toggleMode: () =>
                set((state) => ({
                    mode: state.mode === 'light' ? 'dark' : 'light',
                })),
        }),
        {
            name: 'theme-storage',
        }
    )
)

export default useThemeStore
