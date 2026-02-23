import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import useMovieStore from '@/store/useMovieStore'
import type { Movie } from '@/types/movie'

interface MovieFormProps {
    initialData?: Partial<Movie>
    onSubmit: (data: Omit<Movie, 'id'>) => void
    onCancel: () => void
    submitLabel?: string
}

export default function MovieForm({ initialData, onSubmit, onCancel, submitLabel = 'Guardar' }: MovieFormProps) {
    const { directors, genres, countries } = useMovieStore()

    const [formData, setFormData] = useState<Omit<Movie, 'id'>>({
        name: initialData?.name || '',
        year: initialData?.year || new Date().getFullYear(),
        directors: initialData?.directors || [],
        duration: initialData?.duration || '02:00',
        countries: initialData?.countries || [],
        genres: initialData?.genres || [],
        imdbUrl: initialData?.imdbUrl || '',
        letterboxdUrl: initialData?.letterboxdUrl || '',
        rottenTomatoesUrl: initialData?.rottenTomatoesUrl || '',
        imdbID: initialData?.imdbID || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                    label="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    fullWidth
                    required
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Año"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Duración (HH:MM)"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        fullWidth
                        required
                        placeholder="00:00"
                        helperText="Formato HH:MM"
                    />
                </Box>

                <Autocomplete
                    multiple
                    options={directors}
                    value={formData.directors}
                    onChange={(_, v) => setFormData({ ...formData, directors: v })}
                    renderInput={(params) => <TextField {...params} label="Directores" placeholder="Seleccionar..." />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index })
                            return (
                                <Chip key={key} variant="outlined" label={option} {...tagProps} size="small" />
                            )
                        })
                    }
                />

                <Autocomplete
                    multiple
                    options={genres}
                    value={formData.genres}
                    onChange={(_, v) => setFormData({ ...formData, genres: v })}
                    renderInput={(params) => <TextField {...params} label="Géneros" placeholder="Seleccionar..." />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index })
                            return (
                                <Chip key={key} variant="outlined" label={option} {...tagProps} size="small" />
                            )
                        })
                    }
                />

                <Autocomplete
                    multiple
                    options={countries}
                    value={formData.countries}
                    onChange={(_, v) => setFormData({ ...formData, countries: v })}
                    renderInput={(params) => <TextField {...params} label="Países" placeholder="Seleccionar..." />}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                            const { key, ...tagProps } = getTagProps({ index })
                            return (
                                <Chip key={key} variant="outlined" label={option} {...tagProps} size="small" />
                            )
                        })
                    }
                />

                <TextField
                    label="IMDb ID (tt...)"
                    value={formData.imdbID}
                    onChange={(e) => setFormData({ ...formData, imdbID: e.target.value })}
                    fullWidth
                    placeholder="tt1234567"
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button onClick={onCancel}>Cancelar</Button>
                <Button type="submit" variant="contained">
                    {submitLabel}
                </Button>
            </Box>
        </form>
    )
}
