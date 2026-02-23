import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 'auto' }}>
      <Divider />
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          CineVault - Inventario de Peliculas
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  )
}
