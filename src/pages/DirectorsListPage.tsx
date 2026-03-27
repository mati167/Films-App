import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import VideocamIcon from '@mui/icons-material/Videocam'
import useMovieStore from '@/store/useMovieStore'
import SearchInput from '@/components/SearchInput'
import { useNavigate } from 'react-router-dom'
import { getCountryFlagUrl } from '@/utils/countryFlags'
import Tooltip from '@mui/material/Tooltip'
import LoadingIndicator from '@/components/LoadingIndicator'
import TableSortLabel from '@mui/material/TableSortLabel'

type SortKey = 'name' | 'movieCount'
type SortDirection = 'asc' | 'desc'

export default function DirectorsListPage() {
    const directors = useMovieStore((s) => s.directors)
    const directorMetadata = useMovieStore((s) => s.directorMetadata)
    const directorIds = useMovieStore((s) => s.directorIds)
    const isLoading = useMovieStore((s) => s.isLoading)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('movieCount')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const navigate = useNavigate()

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const directorsList = useMemo(() => {
        const list = directors.map((name) => {
            const metadata = directorMetadata[name]
            // Use the new all-countries array, fall back to single entry for backward compat
            const countries = metadata?.countries?.length
                ? metadata.countries
                : metadata?.countryISO
                    ? [{ name: metadata.country || '', iso: metadata.countryISO }]
                    : []
            return {
                id: directorIds[name] || 0,
                name,
                movieCount: metadata?.totalFilm || 0,
                countries,
            }
        })

        const norm = (s: string) =>
            s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        const filtered = list.filter((d) =>
            d.movieCount > 0 && norm(d.name).includes(norm(searchTerm))
        )

        return filtered.sort((a, b) => {
            let comparison = 0
            if (sortKey === 'name') comparison = a.name.localeCompare(b.name)
            else if (sortKey === 'movieCount') comparison = a.movieCount - b.movieCount
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [directors, searchTerm, sortKey, sortDirection, directorIds, directorMetadata])

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <VideocamIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h4">Directores</Typography>
            </Box>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar director..."
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <TableContainer component={Paper} elevation={0}>
                    <Table>
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
                                <TableCell>Nacionalidad</TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={sortKey === 'movieCount'}
                                        direction={sortKey === 'movieCount' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('movieCount')}
                                    >
                                        Cantidad Peliculas
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {directorsList.map((director) => (
                                <TableRow
                                    key={director.name}
                                    hover
                                    onClick={() => navigate(`/director/${director.id}`)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                            {director.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{director.name}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {director.countries.map((c) =>
                                                c.iso ? (
                                                    <Tooltip key={c.iso} title={c.name} arrow>
                                                        <Box
                                                            component="img"
                                                            src={getCountryFlagUrl(c.iso)}
                                                            alt={c.name}
                                                            sx={{
                                                                width: 28,
                                                                height: 'auto',
                                                                borderRadius: '3px',
                                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                            }}
                                                        />
                                                    </Tooltip>
                                                ) : null
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">{director.movieCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    )
}
