import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MovieIcon from '@mui/icons-material/Movie'
import StarIcon from '@mui/icons-material/Star'
import useAuthStore from '@/store/useAuthStore'
import useMovieStore from '@/store/useMovieStore'
import type { Movie } from '@/types/movie'
import ExternalLinks from './ExternalLinks'
import MovieForm from './MovieForm'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

interface MovieDetailModalProps {
    movie: Movie | null
    onClose: () => void
}

export default function MovieDetailModal({ movie, onClose }: MovieDetailModalProps) {
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
    const { updateMovie, fetchMovieDetails } = useMovieStore()
    const [isEditing, setIsEditing] = useState(false)
    const [omdbData, setOmdbData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setOmdbData(null)
        if (movie?.imdbID) {
            setLoading(true)
            fetchMovieDetails(movie.imdbID)
                .then(data => {
                    if (data && data.Response !== 'False') {
                        setOmdbData(data)
                    }
                })
                .finally(() => setLoading(false))
        }
    }, [movie?.imdbID, fetchMovieDetails])

    if (!movie) return null

    const handleUpdate = (formData: Omit<Movie, 'id'>) => {
        updateMovie(movie.id, formData)
        setIsEditing(false)
    }

    const posterUrl = omdbData?.Poster !== 'N/A' ? omdbData?.Poster : null

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

            <DialogContent dividers sx={{ p: 0 }}>
                {isEditing ? (
                    <Box sx={{ p: 3 }}>
                        <MovieForm
                            initialData={movie}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                            submitLabel="Actualizar"
                        />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* Left Column: Poster & Quick Info */}
                        <Box sx={{
                            width: { xs: '100%', md: 300 },
                            bgcolor: 'rgba(0,0,0,0.05)',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRight: { md: '1px solid' },
                            borderColor: 'divider'
                        }}>
                            <Box sx={{
                                width: '100%',
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                boxShadow: 3,
                                mb: 2,
                                aspectRatio: '2/3',
                                bgcolor: 'action.hover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {loading ? (
                                    <CircularProgress size={40} />
                                ) : posterUrl ? (
                                    <Box component="img" src={posterUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <MovieIcon sx={{ fontSize: 80, opacity: 0.2 }} />
                                )}
                            </Box>

                            {omdbData?.imdbRating && omdbData.imdbRating !== 'N/A' && (
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <StarIcon sx={{ color: '#f5c518' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {omdbData.imdbRating}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">/ 10</Typography>
                                </Stack>
                            )}

                            {omdbData?.Ratings && omdbData.Ratings.length > 0 && (
                                <Box sx={{ width: '100%', mt: 1 }}>
                                    {omdbData.Ratings.map((r: any) => (
                                        <Box key={r.Source} sx={{ mb: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {r.Source}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {r.Value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* Right Column: Full Details */}
                        <Box sx={{ flex: 1, p: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.1 }}>
                                {movie.name}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {movie.year}
                                </Typography>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {omdbData?.Rated || 'N/A'}
                                </Typography>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {omdbData?.Runtime || movie.duration}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Box sx={{ mb: 3 }}>
                                {omdbData?.Genre ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {omdbData.Genre.split(', ').map((g: string) => (
                                            <Chip key={g} label={g} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {movie.genres.map(g => (
                                            <Chip key={g} label={g} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            <Typography variant="body1" sx={{ mb: 3, fontStyle: omdbData?.Plot === 'N/A' ? 'italic' : 'normal' }}>
                                {omdbData?.Plot && omdbData.Plot !== 'N/A' ? omdbData.Plot : 'Sinopsis no disponible.'}
                            </Typography>

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                gap: 2,
                                mb: 3
                            }}>
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
                                    <DetailItem label="Director/es" value={omdbData?.Director || movie.directors.join(', ')} />
                                </Box>
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
                                    <DetailItem label="Escritor/es" value={omdbData?.Writer || 'N/A'} />
                                </Box>
                                <Box sx={{ gridColumn: 'span 2' }}>
                                    <DetailItem label="Actores" value={omdbData?.Actors || 'N/A'} />
                                </Box>
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
                                    <DetailItem label="Idioma" value={omdbData?.Language || 'N/A'} />
                                </Box>
                                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
                                    <DetailItem label="País/es" value={omdbData?.Country || movie.countries.join(', ')} />
                                </Box>
                            </Box>

                            {omdbData?.Awards && omdbData.Awards !== 'N/A' && (
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                    <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                                        Premios
                                    </Typography>
                                    <Typography variant="body2">{omdbData.Awards}</Typography>
                                </Box>
                            )}

                            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
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

function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {value}
            </Typography>
        </Box>
    )
}
