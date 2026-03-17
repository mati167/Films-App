import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import useMovieStore from '@/store/useMovieStore'
import type { Movie } from '@/types/movie'
import { ContinentShape } from '@/utils/continentIcons'
import MovieForm from '@/components/MovieForm'

import TableSortLabel from '@mui/material/TableSortLabel'

export default function AdminPage() {
    const {
        movies, addMovie, updateMovie, deleteMovie,
        directors, addDirector, updateDirector, deleteDirector,
        genres, addGenre, updateGenre, deleteGenre,
        countries, addCountry, updateCountry, deleteCountry,
        directorMetadata, countryMetadata,
        directorIds, countryIds, genreIds,
        directorById
    } = useMovieStore()

    const [tab, setTab] = useState(0)

    // Movie Sorting States
    const [movieSortKey, setMovieSortKey] = useState<string>('name')
    const [movieSortDir, setMovieSortDir] = useState<'asc' | 'desc'>('asc')

    // Entity Sorting States
    const [entitySortDir, setEntitySortDir] = useState<'asc' | 'desc'>('asc')

    // Movie States
    const [movieOpen, setMovieOpen] = useState(false)
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null)

    // Entity States (Directors/Genres/Countries)
    const [entityOpen, setEntityOpen] = useState(false)
    const [editingEntity, setEditingEntity] = useState<string | null>(null)
    const [entityValue, setEntityValue] = useState('')
    // New fields for Director/Country
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [selectedContinent, setSelectedContinent] = useState<string>('')

    const continents = ['America', 'Europa', 'Asia', 'Africa', 'Oceania']

    const sortedMovies = useMemo(() => {
        return [...movies].sort((a, b) => {
            let comp = 0
            if (movieSortKey === 'name') comp = a.name.localeCompare(b.name)
            else if (movieSortKey === 'year') comp = a.year - b.year
            else if (movieSortKey === 'directors') {
                const nameA = directorById[a.directors[0]] || ''
                const nameB = directorById[b.directors[0]] || ''
                comp = nameA.localeCompare(nameB)
            }

            return movieSortDir === 'asc' ? comp : -comp
        })
    }, [movies, movieSortKey, movieSortDir])

    const handleMovieSort = (key: string) => {
        if (movieSortKey === key) setMovieSortDir(movieSortDir === 'asc' ? 'desc' : 'asc')
        else { setMovieSortKey(key); setMovieSortDir('asc'); }
    }

    const currentEntities = useMemo(() => {
        const list = tab === 1 ? directors : tab === 2 ? genres : countries
        return [...list].sort((a, b) => {
            const comp = a.localeCompare(b)
            return entitySortDir === 'asc' ? comp : -comp
        })
    }, [tab, directors, genres, countries, entitySortDir])

    const handleMovieOpen = (movie?: Movie) => {
        if (movie) {
            setEditingMovie(movie)
        } else {
            setEditingMovie(null)
        }
        setMovieOpen(true)
    }

    const handleEntityOpen = (value?: string) => {
        if (value) {
            setEditingEntity(value)
            setEntityValue(value)
            if (tab === 1) { // Director split
                const parts = value.split(' ')
                if (parts.length > 1) {
                    setLastName(parts.pop() || '')
                    setFirstName(parts.join(' '))
                } else {
                    setFirstName(value)
                    setLastName('')
                }
                setSelectedCountry(directorMetadata[value]?.country || '')
            } else if (tab === 3) {
                setSelectedContinent(countryMetadata[value]?.continent || '')
            }
        } else {
            setEditingEntity(null)
            setEntityValue('')
            setFirstName('')
            setLastName('')
            setSelectedCountry('')
            setSelectedContinent('')
        }
        setEntityOpen(true)
    }

    const handleMovieSubmit = (formData: Omit<Movie, 'id'>) => {
        if (editingMovie) updateMovie(editingMovie.id, formData)
        else addMovie(formData)
        setMovieOpen(false)
    }

    const handleEntitySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        let finalValue = entityValue
        if (tab === 1) {
            finalValue = `${firstName} ${lastName}`.trim()
        }

        if (tab === 1) { // Directors
            if (editingEntity) updateDirector(editingEntity, finalValue, { country: selectedCountry })
            else addDirector(finalValue, { country: selectedCountry })
        } else if (tab === 2) { // Genres
            if (editingEntity) updateGenre(editingEntity, finalValue)
            else addGenre(entityValue)
        } else if (tab === 3) { // Countries
            if (editingEntity) updateCountry(editingEntity, finalValue, { continent: selectedContinent })
            else addCountry(finalValue, { continent: selectedContinent })
        }
        setEntityOpen(false)
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Administración</Typography>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Películas" />
                <Tab label="Directores" />
                <Tab label="Géneros" />
                <Tab label="Países" />
            </Tabs>

            {/* MOVIES TAB */}
            {tab === 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleMovieOpen()}>
                            Nueva Película
                        </Button>
                    </Box>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>ID</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={movieSortKey === 'name'}
                                            direction={movieSortKey === 'name' ? movieSortDir : 'asc'}
                                            onClick={() => handleMovieSort('name')}
                                        >
                                            Nombre
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={movieSortKey === 'year'}
                                            direction={movieSortKey === 'year' ? movieSortDir : 'asc'}
                                            onClick={() => handleMovieSort('year')}
                                        >
                                            Año
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={movieSortKey === 'directors'}
                                            direction={movieSortKey === 'directors' ? movieSortDir : 'asc'}
                                            onClick={() => handleMovieSort('directors')}
                                        >
                                            Director/es
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedMovies.map((movie) => (
                                    <TableRow key={movie.id}>
                                        <TableCell align="center">
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                                {movie.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{movie.name}</TableCell>
                                        <TableCell>{movie.year}</TableCell>
                                        <TableCell>{movie.directors.map(dId => directorById[dId] || String(dId)).join(', ')}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleMovieOpen(movie)} color="primary"><EditIcon /></IconButton>
                                            <IconButton onClick={() => deleteMovie(movie.id)} color="error"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* ENTITIES TABS (1=Directors, 2=Genres, 3=Countries) */}
            {(tab === 1 || tab === 2 || tab === 3) && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleEntityOpen()}>
                            Nuevo {tab === 1 ? 'Director' : tab === 2 ? 'Género' : 'País'}
                        </Button>
                    </Box>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ width: 60, fontWeight: 700 }}>ID</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={true}
                                            direction={entitySortDir}
                                            onClick={() => setEntitySortDir(entitySortDir === 'asc' ? 'desc' : 'asc')}
                                        >
                                            Nombre
                                        </TableSortLabel>
                                    </TableCell>
                                    {tab === 1 && <TableCell>Nacionalidad</TableCell>}
                                    {tab === 3 && <TableCell>Continente</TableCell>}
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentEntities.map((item, index) => (
                                    <TableRow key={item}>
                                        <TableCell align="center">
                                            <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                                {tab === 1 ? (directorIds[item] || 0) : tab === 3 ? (countryIds[item] || 0) : (genreIds[item] || 0)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{item}</TableCell>
                                        {tab === 1 && (
                                            <TableCell>
                                                {directorMetadata[item]?.country}
                                            </TableCell>
                                        )}
                                        {tab === 3 && (
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {countryMetadata[item]?.continent && <ContinentShape continent={countryMetadata[item].continent} size={18} />}
                                                    {countryMetadata[item]?.continent}
                                                </Box>
                                            </TableCell>
                                        )}
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEntityOpen(item)} color="primary"><EditIcon /></IconButton>
                                            <IconButton onClick={() => {
                                                if (tab === 1) deleteDirector(item)
                                                else if (tab === 2) deleteGenre(item)
                                                else deleteCountry(item)
                                            }} color="error"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}


            {/* MOVIE DIALOG */}
            <Dialog open={movieOpen} onClose={() => setMovieOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingMovie ? 'Editar Película' : 'Nueva Película'}</DialogTitle>
                <DialogContent>
                    <MovieForm
                        initialData={editingMovie || undefined}
                        onSubmit={handleMovieSubmit}
                        onCancel={() => setMovieOpen(false)}
                        submitLabel={editingMovie ? 'Actualizar' : 'Guardar'}
                    />
                </DialogContent>
            </Dialog>

            {/* ENTITY DIALOG */}
            <Dialog open={entityOpen} onClose={() => setEntityOpen(false)} maxWidth="xs" fullWidth>
                <form onSubmit={handleEntitySubmit}>
                    <DialogTitle>{editingEntity ? 'Editar' : 'Nuevo'} {tab === 1 ? 'Director' : tab === 2 ? 'Género' : 'País'}</DialogTitle>
                    <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {tab === 1 ? (
                            <>
                                <TextField label="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth required autoFocus />
                                <TextField label="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth required />
                                <Autocomplete
                                    options={countries}
                                    value={selectedCountry}
                                    onChange={(_, v) => setSelectedCountry(v || '')}
                                    renderInput={(params) => <TextField {...params} label="País" />}
                                    fullWidth
                                />
                            </>
                        ) : tab === 3 ? (
                            <>
                                <TextField label="Nombre" value={entityValue} onChange={(e) => setEntityValue(e.target.value)} fullWidth required autoFocus />
                                <Autocomplete
                                    options={continents}
                                    value={selectedContinent}
                                    onChange={(_, v) => setSelectedContinent(v || '')}
                                    renderInput={(params) => <TextField {...params} label="Continente" required />}
                                    fullWidth
                                />
                            </>
                        ) : (
                            <TextField label="Nombre" value={entityValue} onChange={(e) => setEntityValue(e.target.value)} fullWidth required autoFocus />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEntityOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="contained">{editingEntity ? 'Actualizar' : 'Guardar'}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    )
}
