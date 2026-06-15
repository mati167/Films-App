import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
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
  const [directorSearch, setDirectorSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'movies'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

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

  const filteredDirectors = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const searched = directorSearch
      ? countryDirectors.filter((d) => norm(d.name).includes(norm(directorSearch)))
      : countryDirectors
    return [...searched].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'name') return mul * a.name.localeCompare(b.name)
      return mul * (a.movieCount - b.movieCount)
    })
  }, [countryDirectors, directorSearch, sortBy, sortDir])

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
        <>
          {/* Search & Sort bar */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar director..."
                value={directorSearch}
                onChange={(e) => setDirectorSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: directorSearch && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setDirectorSearch('')}>
                          <ClearIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <ToggleButtonGroup
                value={sortBy}
                exclusive
                onChange={(_, v) => v && setSortBy(v)}
                size="small"
                sx={{ flexShrink: 0 }}
              >
                <ToggleButton value="name" sx={{ px: 2, fontSize: 12, fontWeight: 600 }}>Nombre</ToggleButton>
                <ToggleButton value="movies" sx={{ px: 2, fontSize: 12, fontWeight: 600 }}>Películas</ToggleButton>
              </ToggleButtonGroup>
              <IconButton
                size="small"
                onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                sx={{ color: 'text.secondary', flexShrink: 0 }}
              >
                {sortDir === 'asc'
                  ? <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                  : <ArrowDownwardIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Paper>

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
                {filteredDirectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      {directorSearch ? 'Sin resultados para esa búsqueda' : 'Sin directores asociados'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDirectors.map((d) => (
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
        </>
      )}
    </Box>
  )
}
