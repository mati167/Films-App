import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
    isLoggedIn: boolean
    user: string | null
    error: string | null
    login: (username: string, password: string) => boolean
    logout: () => void
    clearError: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            error: null,
            login: (_username, _password) => {
                // Login disabled
                set({ error: 'El login está deshabilitado' })
                return false
            },
            logout: () => set({ isLoggedIn: false, user: null, error: null }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
)

export default useAuthStore
