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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'
import useMovieStore from '@/store/useMovieStore'
import SearchInput from '@/components/SearchInput'
import { useNavigate } from 'react-router-dom'
import LoadingIndicator from '@/components/LoadingIndicator'

import TableSortLabel from '@mui/material/TableSortLabel'

type SortKey = 'name' | 'movieCount'
type SortDirection = 'asc' | 'desc'

export default function GenresListPage() {
    const genres = useMovieStore((s) => s.genres)
    const genreMetadata = useMovieStore((s) => s.genreMetadata)
    const genreIds = useMovieStore((s) => s.genreIds)
    const isLoading = useMovieStore((s) => s.isLoading)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('movieCount')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
    const navigate = useNavigate()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const genresList = useMemo(() => {
        const list = genres.map((name) => ({
            id: genreIds[name] || 0,
            name: name,
            movieCount: genreMetadata[name]?.totalFilm || 0
        }))

        const norm = (s: string) =>
            s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        const filtered = list.filter((g) => norm(g.name).includes(norm(searchTerm)))

        return filtered.sort((a, b) => {
            let comparison = 0
            if (sortKey === 'name') {
                comparison = a.name.localeCompare(b.name)
            } else {
                comparison = a.movieCount - b.movieCount
            }
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [genres, searchTerm, sortKey, sortDirection, genreIds, genreMetadata])

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <TheaterComedyIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h4">Generos</Typography>
            </Box>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar genero..."
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : isMobile ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {genresList.map((genre) => (
                        <Card
                            key={genre.name}
                            elevation={0}
                            sx={{
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}
                        >
                            <CardActionArea onClick={() => navigate(`/genre/${genre.id}`)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {genre.name}
                                        </Typography>
                                        <Chip
                                            label={`${genre.movieCount} películas`}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', color: 'primary.light' }}
                                        />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        ID: {genre.id}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Box>
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
                            {genresList.map((genre, index) => (
                                <TableRow
                                    key={genre.name}
                                    hover
                                    onClick={() => navigate(`/genre/${genre.id}`)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                            {genre.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{genre.name}</TableCell>
                                    <TableCell align="center">{genre.movieCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    )
}
