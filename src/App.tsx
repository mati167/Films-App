import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppThemeProvider from '@/theme/ThemeProvider'
import MainLayout from '@/layout/MainLayout'
import HomePage from '@/pages/HomePage'
import CountryPage from '@/pages/CountryPage'
import CountriesListPage from '@/pages/CountriesListPage'
import DirectorPage from '@/pages/DirectorPage'
import DirectorsListPage from '@/pages/DirectorsListPage'
import GenrePage from '@/pages/GenrePage'
import GenresListPage from '@/pages/GenresListPage'
import AdminPage from '@/pages/AdminPage'
import LoginPage from '@/pages/LoginPage'
import useAuthStore from '@/store/useAuthStore'
import useMovieStore from '@/store/useMovieStore'
import { Navigate } from 'react-router-dom'

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const fetchInitialData = useMovieStore((s) => s.fetchInitialData)

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  return (
    <AppThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/films" replace />} />
            <Route path="/films" element={<HomePage />} />
            <Route path="/countries" element={<CountriesListPage />} />
            <Route path="/country/:id" element={<CountryPage />} />
            <Route path="/directors" element={<DirectorsListPage />} />
            <Route path="/director/:id" element={<DirectorPage />} />
            <Route path="/genres" element={<GenresListPage />} />
            <Route path="/genre/:id" element={<GenrePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppThemeProvider>
  )
}
