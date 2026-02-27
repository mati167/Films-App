import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MovieIcon from '@mui/icons-material/Movie'
import useMovieStore from '@/store/useMovieStore'
import MovieSearch from '@/components/MovieSearch'
import MovieTable from '@/components/MovieTable'
import LoadingIndicator from '@/components/LoadingIndicator'
import { useMemo } from 'react'

export default function HomePage() {
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const allMovies = useMovieStore((s) => s.movies)
  const isLoading = useMovieStore((s) => s.isLoading)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredMovies = useMemo(() => getFilteredMovies(), [filters, allMovies])

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
          <MovieIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Catalogo de Peliculas
          </Typography>
        </Box>
        <Chip
          label={`${filteredMovies.length} de ${allMovies.length} peliculas`}
          size="small"
          sx={{
            backgroundColor: 'rgba(229, 9, 20, 0.1)',
            color: 'primary.light',
            fontWeight: 600,
          }}
        />
      </Box>

      <MovieSearch />
      {isLoading ? <LoadingIndicator /> : <MovieTable movies={filteredMovies} />}
    </Box>
  )
}
