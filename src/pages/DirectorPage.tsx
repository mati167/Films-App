import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import VideocamIcon from '@mui/icons-material/Videocam'
import useMovieStore from '@/store/useMovieStore'
import MovieTable from '@/components/MovieTable'
import MovieSearch from '@/components/MovieSearch'
import { getCountryFlag } from '@/utils/countryFlags'

export default function DirectorPage() {
  const { id } = useParams<{ id: string }>()
  const directorIds = useMovieStore((s) => s.directorIds)
  const directorMetadata = useMovieStore((s) => s.directorMetadata)
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const movies = useMovieStore((s) => s.movies)

  const directorName = useMemo(() => {
    return Object.keys(directorIds).find((name) => directorIds[name] === Number(id))
  }, [id, directorIds])

  const origin = directorName ? directorMetadata[directorName]?.country : null

  const directorMoviesTotal = useMemo(() => {
    if (!directorName) return 0
    return movies.filter(m => m.directors.includes(directorName)).length
  }, [directorName, movies])

  const filteredMovies = useMemo(() => {
    if (!directorName) return []
    return getFilteredMovies().filter((m) => m.directors.includes(directorName))
  }, [getFilteredMovies, filters, directorName, movies])

  if (!directorName) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Director no encontrado
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
          <VideocamIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Peliculas dirigidas por
              </Typography>
              {origin && (
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  • {getCountryFlag(origin)} {origin}
                </Typography>
              )}
            </Box>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              {directorName}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${filteredMovies.length} de ${directorMoviesTotal} peliculas`}
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
