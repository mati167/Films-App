import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    showIdSearch?: boolean
    idValue?: number | null
    onIdChange?: (value: number | null) => void
}

export default function SearchInput({ 
    value, 
    onChange, 
    placeholder,
    showIdSearch = false,
    idValue,
    onIdChange
}: SearchInputProps) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {showIdSearch && (
                <TextField
                    size="small"
                    placeholder="ID"
                    value={idValue ?? ''}
                    onChange={(e) => {
                        const val = e.target.value
                        onIdChange?.(val === '' ? null : parseInt(val, 10))
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
            )}
            <TextField
                fullWidth
                size="small"
                placeholder={placeholder || 'Buscar...'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
        </Box>
    )
}
