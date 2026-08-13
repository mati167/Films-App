import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import FilterListIcon from '@mui/icons-material/FilterList'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Autocomplete from '@mui/material/Autocomplete'
import Collapse from '@mui/material/Collapse'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import useMovieStore from '@/store/useMovieStore'

function minutesToHHMMSS(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}

function HHMMSSToMinutes(hhmmss: string): number {
  const [h, m] = hhmmss.split(':').map(Number)
  return h * 60 + m
}

export default function MovieSearch() {
  const { filters, setFilter, resetFilters, directors, genres, countries, directorIds, genreIds, countryIds } = useMovieStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [localDuration, setLocalDuration] = useState<number>(
    filters.maxDuration ? HHMMSSToMinutes(filters.maxDuration) : 240
  )

  useEffect(() => {
    setLocalDuration(filters.maxDuration ? HHMMSSToMinutes(filters.maxDuration) : 240)
  }, [filters.maxDuration])

  const hasActiveFilters =
    filters.name ||
    filters.id !== null ||
    filters.country !== null ||
    filters.director !== null ||
    (filters.genre !== null && filters.genre.length > 0) ||
    filters.maxDuration !== null

  // Build option lists: { id: number, label: string }
  const directorOptions = directors.map((name) => ({ id: directorIds[name], label: name }))
  const genreOptions = genres.map((name) => ({ id: genreIds[name], label: name }))
  const countryOptions = countries.map((name) => ({ id: countryIds[name], label: name }))

  const selectedDirector = directorOptions.find((o) => o.id === filters.director) ?? null
  const selectedGenres = filters.genre ? genreOptions.filter((o) => filters.genre!.includes(o.id)) : []
  const selectedCountry = countryOptions.find((o) => o.id === filters.country) ?? null

  return (
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: showAdvanced ? 2 : 0 }}>
        <TextField
          size="small"
          placeholder="ID"
          value={filters.id ?? ''}
          onChange={(e) => {
            const val = e.target.value
            setFilter('id', val === '' ? null : parseInt(val, 10))
          }}
          sx={{ width: 100 }}
          type="number"
          slotProps={{
            htmlInput: { min: 1 },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>#</Typography>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nombre de pelicula..."
          value={filters.name}
          onChange={(e) => setFilter('name', e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Tooltip title={showAdvanced ? 'Ocultar filtros' : 'Mostrar filtros avanzados'} arrow>
          <IconButton
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{
              color: showAdvanced ? 'primary.main' : 'text.secondary',
              backgroundColor: showAdvanced ? 'rgba(229, 9, 20, 0.08)' : 'transparent',
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        {hasActiveFilters && (
          <Tooltip title="Limpiar filtros" arrow>
            <IconButton
              onClick={resetFilters}
              sx={{ color: 'text.secondary' }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Collapse in={showAdvanced}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            pt: 1,
          }}
        >
          <Autocomplete
            options={countryOptions}
            value={selectedCountry}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, v) => setFilter('country', v ? v.id : null)}
            renderInput={(params) => <TextField {...params} size="small" label="País" placeholder="ej. Argentina" />}
          />
          <Autocomplete
            options={directorOptions}
            value={selectedDirector}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            onChange={(_, v) => setFilter('director', v ? v.id : null)}
            renderInput={(params) => <TextField {...params} size="small" label="Director" placeholder="ej. Tarantino" />}
          />
          <Box>
            <Autocomplete
              multiple
              options={genreOptions}
              value={selectedGenres}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              onChange={(_, v) => setFilter('genre', v.length > 0 ? v.map(x => x.id) : null)}
              renderInput={(params) => <TextField {...params} size="small" label="Géneros" placeholder="ej. Drama, Thriller" />}
            />
            <ToggleButtonGroup
              value={filters.genreMatchMode}
              exclusive
              size="small"
              onChange={(_, mode) => mode && setFilter('genreMatchMode', mode)}
              sx={{ mt: 1 }}
            >
              <ToggleButton value="and" sx={{ px: 2, fontSize: 12, fontWeight: 600 }}>Todos</ToggleButton>
              <ToggleButton value="or" sx={{ px: 2, fontSize: 12, fontWeight: 600 }}>Cualquiera</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Duración maxima: {filters.maxDuration ? filters.maxDuration.substring(0, 5) : 'Sin límite'}
              </Typography>
            </Box>
            <Slider
              value={localDuration}
              onChange={(_, value) => setLocalDuration(value as number)}
              onChangeCommitted={(_, value) =>
                setFilter('maxDuration', value === 240 ? null : minutesToHHMMSS(value as number))
              }
              min={60}
              max={240}
              step={5}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${Math.floor(v / 60)}h ${v % 60}m`}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                },
              }}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  )
}
