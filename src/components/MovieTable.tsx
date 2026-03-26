import { useState, useMemo } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import type { Movie } from '@/types/movie'
import ChipLink from './ChipLink'
import ExternalLinks from './ExternalLinks'
import { getCountryFlagUrl } from '@/utils/countryFlags'
import Tooltip from '@mui/material/Tooltip'
import useMovieStore from '@/store/useMovieStore'
import MovieDetailModal from './MovieDetailModal'

type SortKey = 'name' | 'year' | 'duration' | 'directors' | 'countries' | 'genres'
type SortDirection = 'asc' | 'desc'

interface MovieTableProps {
  movies: Movie[]
}

export default function MovieTable({ movies }: MovieTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const directorById = useMovieStore((s) => s.directorById)
  const genreById = useMovieStore((s) => s.genreById)
  const countryById = useMovieStore((s) => s.countryById)
  const countryISOById = useMovieStore((s) => s.countryISOById)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedMovies = useMemo(() => {
    type ExpandedMovie = Movie & { displayCountryId?: number }
    let list: ExpandedMovie[] = movies

    if (sortKey === 'countries') {
      list = movies.flatMap((movie): ExpandedMovie[] =>
        movie.countries.length > 0
          ? movie.countries.map((cId) => ({ ...movie, displayCountryId: cId }))
          : [{ ...movie }]
      )
    }

    return [...list].sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'year':
          comparison = a.year - b.year
          break
        case 'duration':
          comparison = a.duration.localeCompare(b.duration)
          break
        case 'directors': {
          const nameA = directorById[a.directors[0]] || ''
          const nameB = directorById[b.directors[0]] || ''
          comparison = nameA.localeCompare(nameB)
          break
        }
        case 'countries': {
          const nameA = countryById[(a as ExpandedMovie).displayCountryId ?? a.countries[0]] || ''
          const nameB = countryById[(b as ExpandedMovie).displayCountryId ?? b.countries[0]] || ''
          comparison = nameA.localeCompare(nameB)
          break
        }
        case 'genres': {
          const nameA = genreById[a.genres[0]] || ''
          const nameB = genreById[b.genres[0]] || ''
          comparison = nameA.localeCompare(nameB)
          break
        }
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [movies, sortKey, sortDirection, directorById, genreById, countryById])

  if (movies.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No se encontraron peliculas
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Intenta ajustar los filtros de busqueda
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ backgroundColor: 'background.paper' }}
    >
      <Table sx={{ minWidth: 900 }} aria-label="tabla de peliculas">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>ID</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortKey === 'name'}
                direction={sortKey === 'name' ? sortDirection : 'asc'}
                onClick={() => handleSort('name')}
              >
                Nombre
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ minWidth: 70 }}>
              <TableSortLabel
                active={sortKey === 'year'}
                direction={sortKey === 'year' ? sortDirection : 'asc'}
                onClick={() => handleSort('year')}
              >
                Año
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ minWidth: 180 }}>
              <TableSortLabel
                active={sortKey === 'directors'}
                direction={sortKey === 'directors' ? sortDirection : 'asc'}
                onClick={() => handleSort('directors')}
              >
                Director/es
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ minWidth: 90 }}>
              <TableSortLabel
                active={sortKey === 'duration'}
                direction={sortKey === 'duration' ? sortDirection : 'asc'}
                onClick={() => handleSort('duration')}
              >
                DURACION
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ minWidth: 160 }}>
              <TableSortLabel
                active={sortKey === 'countries'}
                direction={sortKey === 'countries' ? sortDirection : 'asc'}
                onClick={() => handleSort('countries')}
              >
                Pais/es
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ minWidth: 200 }}>
              <TableSortLabel
                active={sortKey === 'genres'}
                direction={sortKey === 'genres' ? sortDirection : 'asc'}
                onClick={() => handleSort('genres')}
              >
                Genero/s
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ minWidth: 120 }}>Links</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(sortedMovies as (Movie & { displayCountryId?: number })[]).map((movie) => (
            <TableRow key={`${movie.id}-${movie.displayCountryId ?? 'all'}`}>
              <TableCell align="center">
                <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {movie.id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  onClick={() => setSelectedMovie(movie)}
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.dark'
                    }
                  }}
                >
                  {movie.name}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {movie.year}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {movie.directors.map((dirId) => {
                    const dirName = directorById[dirId] || String(dirId)
                    return (
                      <ChipLink
                        key={dirId}
                        label={dirName}
                        to={`/director/${dirId}`}
                        color="secondary"
                      />
                    )
                  })}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                  {movie.duration}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {[
                    ...(movie.displayCountryId ? [movie.displayCountryId] : []),
                    ...movie.countries.filter((c) => c !== movie.displayCountryId),
                    ].map((cId) => {
                      const countryName = countryById[cId] || String(cId)
                      const iso = countryISOById[cId] || ''
                      return (
                        <Tooltip key={cId} title={countryName} arrow>
                          <Box component="span">
                            <ChipLink
                              label=""
                              to={`/country/${cId}`}
                              sx={{
                                p: 0,
                                minWidth: 32,
                                height: 22,
                                backgroundImage: `url(${getCountryFlagUrl(iso)})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}
                            />
                          </Box>
                        </Tooltip>
                      )
                    })}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {movie.genres.map((gId) => {
                    const genreName = genreById[gId] || String(gId)
                    return (
                      <ChipLink
                        key={gId}
                        label={genreName}
                        to={`/genre/${gId}`}
                        color="primary"
                        variant="outlined"
                      />
                    )
                  })}
                </Box>
              </TableCell>
              <TableCell align="center">
                <ExternalLinks
                  movieName={movie.name}
                  movieYear={movie.year}
                  imdbID={movie.imdbID}
                  imdbUrl={movie.imdbUrl}
                  letterboxdUrl={movie.letterboxdUrl}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </TableContainer>
  )
}
