import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import VideocamIcon from '@mui/icons-material/Videocam'
import useMovieStore from '@/store/useMovieStore'
import MovieTable from '@/components/MovieTable'
import MovieSearch from '@/components/MovieSearch'
import { getCountryFlagUrl } from '@/utils/countryFlags'

export default function DirectorPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)

  const directorById = useMovieStore((s) => s.directorById)
  const directorMetadata = useMovieStore((s) => s.directorMetadata)
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const movies = useMovieStore((s) => s.movies)

  const directorName = directorById[numId]
  const metadata = directorName ? directorMetadata[directorName] : null
  // All countries, falling back to single entry if new field not yet populated
  const allCountries = metadata?.countries?.length
    ? metadata.countries
    : metadata?.countryISO
      ? [{ name: metadata.country || '', iso: metadata.countryISO }]
      : []

  const directorMoviesTotal = useMemo(() => {
    return movies.filter(m => m.directors.includes(numId)).length
  }, [numId, movies])

  const filteredMovies = useMemo(() => {
    return getFilteredMovies().filter((m) => m.directors.includes(numId))
  }, [getFilteredMovies, filters, numId, movies])

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
              {allCountries.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>•</Typography>
                  {allCountries.map((c) => (
                    <Box key={c.iso || c.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      {c.iso && (
                        <Box
                          component="img"
                          src={getCountryFlagUrl(c.iso)}
                          alt={c.name}
                          sx={{ width: 16, height: 'auto', borderRadius: '2px' }}
                        />
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.name}</Typography>
                    </Box>
                  ))}
                </Box>
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
