import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, error, clearError, isLoggedIn } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/admin')
        }
        return () => clearError()
    }, [isLoggedIn, navigate, clearError])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (login(username, password)) {
            navigate('/admin')
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 400,
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    backgroundColor: 'background.paper',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Acceso Administrador
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Usuario"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, height: 48 }}
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                <Box sx={{ mt: 2, p: 2, width: '100%', bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                        ACCESO DE PRUEBA:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        Usuario: <strong>admin</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        Contraseña: <strong>admin123</strong>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    )
}
