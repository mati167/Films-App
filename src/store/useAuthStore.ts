import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE_URL } from '../config'

interface AuthState {
    isLoggedIn: boolean
    user: string | null
    error: string | null
    login: (username: string, password: string) => Promise<boolean>
    logout: () => void
    clearError: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            error: null,
            login: async (username, password) => {
                try {
                    const response = await fetch(`${API_BASE_URL}/login/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userName: username, password }),
                    })

                    if (!response.ok) throw new Error(`HTTP ${response.status}`)

                    const data = await response.json()

                    if (data?.response === true) {
                        set({ isLoggedIn: true, user: username, error: null })
                        return true
                    }

                    set({ error: 'Usuario o contraseña incorrectos' })
                    return false
                } catch (err) {
                    set({ error: 'Error al conectar con el servidor' })
                    return false
                }
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
