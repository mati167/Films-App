import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { getTheme } from './theme'
import useThemeStore from '@/store/useThemeStore'
import { useMemo } from 'react'

interface AppThemeProviderProps {
  children: React.ReactNode
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  const mode = useThemeStore((state) => state.mode)
  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
