import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import PublicIcon from '@mui/icons-material/Public'
import VideocamIcon from '@mui/icons-material/Videocam'
import useMovieStore from '@/store/useMovieStore'
import MovieTable from '@/components/MovieTable'
import MovieSearch from '@/components/MovieSearch'
import { ContinentShape } from '@/utils/continentIcons'
import { getCountryFlagUrl } from '@/utils/countryFlags'
import Tooltip from '@mui/material/Tooltip'
import type { Movie } from '@/types/movie'

export default function CountryPage() {
  const { id } = useParams<{ id: string }>()
  const numId = Number(id)
  const navigate = useNavigate()

  const countryById = useMovieStore((s) => s.countryById)
  const countryISOById = useMovieStore((s) => s.countryISOById)
  const countryMetadata = useMovieStore((s) => s.countryMetadata)
  const getFilteredMovies = useMovieStore((s) => s.getFilteredMovies)
  const filters = useMovieStore((s) => s.filters)
  const movies = useMovieStore((s) => s.movies)
  const directors = useMovieStore((s) => s.directors)
  const directorMetadata = useMovieStore((s) => s.directorMetadata)
  const directorIds = useMovieStore((s) => s.directorIds)

  const [tab, setTab] = useState(0)

  const countryName = countryById[numId]
  const continent = countryName ? countryMetadata[countryName]?.continent : undefined
  const countryISO = countryISOById[numId]

  const filteredMovies = useMemo(
    () => getFilteredMovies().filter((m: Movie) => m.countries.includes(numId)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getFilteredMovies, filters, numId, movies]
  )

  // Directors associated to this country (via their countries array)
  const countryDirectors = useMemo(() => {
    return directors
      .map((name) => {
        const meta = directorMetadata[name]
        const linked = meta?.countries?.some((c) => c.name === countryName)
          || (meta?.country === countryName)
        return linked ? { id: directorIds[name] || 0, name, movieCount: meta?.totalFilm || 0 } : null
      })
      .filter(Boolean) as { id: number; name: string; movieCount: number }[]
  }, [directors, directorMetadata, directorIds, countryName])

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
      {/* Header */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {countryISO && (
                <Tooltip title={countryName} arrow>
                  <Box
                    component="img"
                    src={getCountryFlagUrl(countryISO)}
                    alt={countryName}
                    sx={{ width: 28, height: 'auto', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                  />
                </Tooltip>
              )}
              <Typography variant="h4" sx={{ color: 'text.primary' }}>
                {countryName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${filteredMovies.length} película${filteredMovies.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', color: 'primary.light', fontWeight: 600 }}
          />
          <Chip
            label={`${countryDirectors.length} director${countryDirectors.length !== 1 ? 'es' : ''}`}
            size="small"
            sx={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'text.secondary', fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Películas" />
        <Tab label="Directores" />
      </Tabs>

      {tab === 0 && (
        <>
          <MovieSearch />
          <MovieTable movies={filteredMovies} />
        </>
      )}

      {tab === 1 && (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Películas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countryDirectors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Sin directores asociados
                  </TableCell>
                </TableRow>
              ) : (
                countryDirectors.map((d) => (
                  <TableRow
                    key={d.id}
                    hover
                    onClick={() => navigate(`/director/${d.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                        {d.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideocamIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        {d.name}
                      </Box>
                    </TableCell>
                    <TableCell align="center">{d.movieCount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
