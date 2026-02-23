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
            login: (username, password) => {
                // Mock validation
                if (username === 'admin' && password === 'admin123') {
                    set({ isLoggedIn: true, user: 'Administrador', error: null })
                    return true
                }
                set({ error: 'Credenciales incorrectas' })
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
