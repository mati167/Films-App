import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MovieFilterIcon from '@mui/icons-material/MovieFilter'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import { useNavigate, useLocation } from 'react-router-dom'
import useThemeStore from '@/store/useThemeStore'
import useAuthStore from '@/store/useAuthStore'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleMode } = useThemeStore()
  const { isLoggedIn, logout } = useAuthStore()

  const navItems = [
    { label: 'Peliculas', path: '/films' },
    { label: 'Generos', path: '/genres' },
    { label: 'Paises', path: '/countries' },
    { label: 'Directores', path: '/directors' },
  ]

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': { opacity: 0.85 },
            transition: 'opacity 0.2s',
          }}
          onClick={() => navigate('/films')}
          role="button"
          tabIndex={0}
          aria-label="Ir al inicio"
        >
          <MovieFilterIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #E50914 0%, #FF3D47 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            CineVault
          </Typography>
        </Box>

        <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
          <IconButton
            onClick={toggleMode}
            sx={{ ml: 2, color: 'text.secondary' }}
            size="small"
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'contained' : 'text'}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              onClick={() => navigate(item.path)}
              size="small"
              sx={{
                fontWeight: 600,
                color: location.pathname === item.path ? 'white' : 'text.secondary'
              }}
            >
              {item.label}
            </Button>
          ))}

          <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
            {/* 
            {isLoggedIn ? (
              <>
                <Button
                  variant={location.pathname === '/admin' ? 'contained' : 'outlined'}
                  color="secondary"
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/admin')}
                >
                  Gestión
                </Button>
                <IconButton color="error" size="small" onClick={logout}>
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login (Admin)
              </Button>
            )}
            */}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
