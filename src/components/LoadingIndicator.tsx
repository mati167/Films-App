import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function LoadingIndicator() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                gap: 2,
            }}
        >
            <CircularProgress size={40} thickness={4} sx={{ color: 'primary.main' }} />
            <Typography
                variant="body1"
                sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                }}
            >
                Cargando...
            </Typography>
        </Box>
    )
}
