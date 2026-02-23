import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'
import Footer from './Footer'

export default function MainLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Header />
      <Navigation />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
