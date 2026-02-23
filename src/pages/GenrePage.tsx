import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import useMovieStore from '@/store/useMovieStore'
import MovieTable from '@/components/MovieTable'
import MovieSearch from '@/components/MovieSearch'

export default function GenrePage() {
  const { id } = useParams<{ id: string }>()
  const genreIds = useMovieStore((s) => s.genreIds)
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const movies = useMovieStore((s) => s.movies)

  const genreName = useMemo(() => {
    return Object.keys(genreIds).find((name) => genreIds[name] === Number(id))
  }, [id, genreIds])

  const genreMoviesTotal = useMemo(() => {
    if (!genreName) return 0
    return movies.filter(m => m.genres.includes(genreName)).length
  }, [genreName, movies])

  const filteredMovies = useMemo(() => {
    if (!genreName) return []
    return getFilteredMovies().filter((m) => m.genres.includes(genreName))
  }, [getFilteredMovies, filters, genreName, movies])

  if (!genreName) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Genero no encontrado
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TheaterComedyIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Peliculas del genero
            </Typography>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              {genreName}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${filteredMovies.length} de ${genreMoviesTotal} peliculas`}
          size="small"
          sx={{
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
            color: 'primary.light',
            fontWeight: 600,
          }}
        />
      </Box>

      <MovieSearch />
      <MovieTable movies={filteredMovies} />
    </Box>
  )
}
