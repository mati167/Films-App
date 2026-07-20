import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
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
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
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
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    // Search States
    const [movieSearch, setMovieSearch] = useState('')
    const [entitySearch, setEntitySearch] = useState('')

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
    const [isoCode, setIsoCode] = useState('')

    const continents = ['America', 'Europa', 'Asia', 'Africa', 'Oceania']

    const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const sortedMovies = useMemo(() => {
        const filtered = movieSearch
            ? movies.filter((m) => {
                const dirNames = m.directors.map(id => directorById[id] || '').join(' ')
                return norm(m.name).includes(norm(movieSearch)) || norm(dirNames).includes(norm(movieSearch))
              })
            : movies
        return [...filtered].sort((a, b) => {
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
    }, [movies, movieSortKey, movieSortDir, movieSearch, directorById])

    const handleMovieSort = (key: string) => {
        if (movieSortKey === key) setMovieSortDir(movieSortDir === 'asc' ? 'desc' : 'asc')
        else { setMovieSortKey(key); setMovieSortDir('asc'); }
    }

    const currentEntities = useMemo(() => {
        const list = tab === 1 ? directors : tab === 2 ? genres : countries
        const filtered = entitySearch
            ? list.filter((item) => norm(item).includes(norm(entitySearch)))
            : list
        return [...filtered].sort((a, b) => {
            const comp = a.localeCompare(b)
            return entitySortDir === 'asc' ? comp : -comp
        })
    }, [tab, directors, genres, countries, entitySortDir, entitySearch])

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
            if (tab === 1) { // Director split — format is "Apellido, Nombre"
                const commaIdx = value.indexOf(', ')
                if (commaIdx !== -1) {
                    setLastName(value.substring(0, commaIdx))
                    setFirstName(value.substring(commaIdx + 2))
                } else {
                    setFirstName(value)
                    setLastName('')
                }
                setSelectedCountry(directorMetadata[value]?.country || '')
            } else if (tab === 3) {
                setSelectedContinent(countryMetadata[value]?.continent || '')
                setIsoCode(countryMetadata[value]?.isoCode || '')
            }
        } else {
            setEditingEntity(null)
            setEntityValue('')
            setFirstName('')
            setLastName('')
            setSelectedCountry('')
            setSelectedContinent('')
            setIsoCode('')
        }
        setEntityOpen(true)
    }

    const handleMovieSubmit = async (formData: Omit<Movie, 'id'>) => {
        try {
            if (editingMovie) await updateMovie(editingMovie.id, formData)
            else await addMovie(formData)
            setMovieOpen(false)
        } catch (err: any) {
            setErrorMsg(err?.message || 'Error al guardar la película')
        }
    }

    const handleEntitySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        let finalValue = entityValue
        if (tab === 1) {
            finalValue = `${lastName}, ${firstName}`.trim()
        }

        try {
            if (tab === 1) { // Directors
                const countryId = countryIds[selectedCountry] || 0
                if (editingEntity) await updateDirector(editingEntity, finalValue, { country: selectedCountry })
                else await addDirector(finalValue, { country: selectedCountry }, countryId)
            } else if (tab === 2) { // Genres
                if (editingEntity) await updateGenre(editingEntity, finalValue)
                else await addGenre(entityValue)
            } else if (tab === 3) { // Countries
                if (editingEntity) await updateCountry(editingEntity, finalValue, { continent: selectedContinent, isoCode })
                else await addCountry(finalValue, { continent: selectedContinent, isoCode })
            }
            setEntityOpen(false)
        } catch (err: any) {
            setErrorMsg(err?.message || 'Error al guardar el director')
        }
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4 }}>Administración</Typography>

            <Tabs value={tab} onChange={(_, v) => { setTab(v); setMovieSearch(''); setEntitySearch('') }} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Películas" />
                <Tab label="Directores" />
                <Tab label="Géneros" />
                <Tab label="Países" />
            </Tabs>

            {/* MOVIES TAB */}
            {tab === 0 && (
                <>
                    <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Buscar por nombre o director..."
                                value={movieSearch}
                                onChange={(e) => setMovieSearch(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                                        endAdornment: movieSearch && <InputAdornment position="end"><IconButton size="small" onClick={() => setMovieSearch('')}><ClearIcon sx={{ fontSize: 18 }} /></IconButton></InputAdornment>,
                                    },
                                }}
                            />
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleMovieOpen()} sx={{ flexShrink: 0 }}>
                                Nueva Película
                            </Button>
                        </Box>
                    </Paper>
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
                    <Paper elevation={0} sx={{ p: 2.5, mb: 3, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder={`Buscar ${tab === 1 ? 'director' : tab === 2 ? 'género' : 'país'}...`}
                                value={entitySearch}
                                onChange={(e) => setEntitySearch(e.target.value)}
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                                        endAdornment: entitySearch && <InputAdornment position="end"><IconButton size="small" onClick={() => setEntitySearch('')}><ClearIcon sx={{ fontSize: 18 }} /></IconButton></InputAdornment>,
                                    },
                                }}
                            />
                            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleEntityOpen()} sx={{ flexShrink: 0 }}>
                                Nuevo {tab === 1 ? 'Director' : tab === 2 ? 'Género' : 'País'}
                            </Button>
                        </Box>
                    </Paper>
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
                                <TextField
                                    label="Código ISO"
                                    value={isoCode}
                                    onChange={(e) => setIsoCode(e.target.value.toUpperCase().slice(0, 2))}
                                    slotProps={{ htmlInput: { maxLength: 2 } }}
                                    helperText="2 caracteres (ej: AR, US)"
                                    fullWidth
                                    required
                                />
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

            <Snackbar
                open={!!errorMsg}
                autoHideDuration={5000}
                onClose={() => setErrorMsg(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ width: '100%' }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </Box>
    )
}
