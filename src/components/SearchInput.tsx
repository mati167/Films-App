import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
    return (
        <TextField
            fullWidth
            size="small"
            placeholder={placeholder || 'Buscar...'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => onChange('')}>
                                <ClearIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}
