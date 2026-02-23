import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MovieIcon from '@mui/icons-material/Movie'
import useAuthStore from '@/store/useAuthStore'
import useMovieStore from '@/store/useMovieStore'
import type { Movie } from '@/types/movie'
import ExternalLinks from './ExternalLinks'
import MovieForm from './MovieForm'

interface MovieDetailModalProps {
    movie: Movie | null
    onClose: () => void
}

export default function MovieDetailModal({ movie, onClose }: MovieDetailModalProps) {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
    const { updateMovie, omdbApiKey } = useMovieStore()
    const [isEditing, setIsEditing] = useState(false)
    const [posterUrl, setPosterUrl] = useState<string | null>(null)
    const [loadingPoster, setLoadingPoster] = useState(false)
    const [authError, setAuthError] = useState(false)

    useEffect(() => {
        setPosterUrl(null)
        setAuthError(false)
        const id = movie?.imdbID
        const name = movie?.name
        const year = movie?.year

        console.log(`Buscando póster para: ${name} [ID: ${id}]`);

        if (id || name) {
            setLoadingPoster(true)
            const query = id ? `i=${id}` : `t=${encodeURIComponent(name || '')}&y=${year}`

            fetch(`https://www.omdbapi.com/?${query}&apikey=${omdbApiKey}`)
                .then(res => {
                    if (res.status === 401) {
                        setAuthError(true)
                        throw new Error('401 Unauthorized')
                    }
                    return res.json()
                })
                .then(data => {
                    console.log('Respuesta OMDb:', data);
                    if (data.Poster && data.Poster !== 'N/A') {
                        setPosterUrl(data.Poster)
                    } else if (id && name) {
                        // Fallback por título si el ID falló
                        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(name)}&y=${year}&apikey=${omdbApiKey}`)
                            .then(res => {
                                if (res.status === 401) {
                                    setAuthError(true)
                                    return { Response: 'False' }
                                }
                                return res.json()
                            })
                            .then(data2 => {
                                if (data2.Poster && data2.Poster !== 'N/A') {
                                    setPosterUrl(data2.Poster)
                                }
                            })
                    }
                })
                .catch(err => {
                    if (err.message !== '401 Unauthorized') {
                        console.error('Error fetching poster:', err)
                    }
                })
                .finally(() => setLoadingPoster(false))
        }
    }, [movie?.imdbID, movie?.name, movie?.year, omdbApiKey])

    if (!movie) return null

    const handleUpdate = (formData: Omit<Movie, 'id'>) => {
        updateMovie(movie.id, formData)
        setIsEditing(false)
    }

    return (
        <Dialog open={!!movie} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MovieIcon color="primary" />
                    <Typography variant="h6" component="span">
                        {isEditing ? 'Editar Película' : 'Detalles de la Película'}
                    </Typography>
                </Box>
                <Box>
                    {isLoggedIn && !isEditing && (
                        <IconButton onClick={() => setIsEditing(true)} color="primary" size="small" sx={{ mr: 1 }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                {isEditing ? (
                    <MovieForm
                        initialData={movie}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                        submitLabel="Actualizar"
                    />
                ) : (
                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                        {/* Poster Section */}
                        <Box sx={{
                            width: { xs: '100%', sm: 220 },
                            minWidth: { sm: 220 },
                            height: 330,
                            backgroundColor: 'action.hover',
                            borderRadius: 2,
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid',
                            borderColor: 'divider',
                            flexShrink: 0
                        }}>
                            {posterUrl ? (
                                <Box
                                    component="img"
                                    src={posterUrl}
                                    alt={movie.name}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Box sx={{ textAlign: 'center', color: authError ? 'error.main' : 'text.disabled', p: 2 }}>
                                    <MovieIcon sx={{ fontSize: 60, mb: 1, opacity: 0.5 }} />
                                    <Typography variant="caption" display="block">
                                        {authError ? 'Error de API (401: Inválida)' : 'Post de IMDb no disponible'}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        {/* Details Section */}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', lineHeight: 1.2 }}>
                                {movie.name}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
                                <Chip label={movie.year} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {movie.duration}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                                    Director/es
                                </Typography>
                                <Typography variant="body1">
                                    {movie.directors.join(', ')}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                                    Géneros
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {movie.genres.map(g => (
                                        <Chip key={g} label={g} size="small" sx={{ borderRadius: 1 }} />
                                    ))}
                                </Box>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                                    País/es
                                </Typography>
                                <Typography variant="body1">
                                    {movie.countries.join(', ')}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-start' }}>
                                <ExternalLinks
                                    movieName={movie.name}
                                    movieYear={movie.year}
                                    imdbID={movie.imdbID}
                                    imdbUrl={movie.imdbUrl}
                                    letterboxdUrl={movie.letterboxdUrl}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}
