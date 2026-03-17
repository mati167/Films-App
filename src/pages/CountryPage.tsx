import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import PublicIcon from '@mui/icons-material/Public'
import useMovieStore from '@/store/useMovieStore'
import MovieTable from '@/components/MovieTable'
import MovieSearch from '@/components/MovieSearch'
import { ContinentShape } from '@/utils/continentIcons'
import type { Movie } from '@/types/movie'

export default function CountryPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)

  const countryById = useMovieStore((s) => s.countryById)
  const countryMetadata = useMovieStore((s) => s.countryMetadata)
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const movies = useMovieStore((s) => s.movies)

  const countryName = countryById[numId]
  const continent = countryName ? countryMetadata[countryName]?.continent : undefined

  const filteredMovies = useMemo(
    () => getFilteredMovies().filter((m: Movie) => m.countries.includes(numId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFilteredMovies, filters, numId, movies]
  )

  if (!countryName) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          País no encontrado
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
          <PublicIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Peliculas de
              </Typography>
              {continent && (
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  • <ContinentShape continent={continent} size={16} /> {continent}
                </Typography>
              )}
            </Box>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>
              {countryName}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${filteredMovies.length} pelicula${filteredMovies.length !== 1 ? 's' : ''}`}
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
