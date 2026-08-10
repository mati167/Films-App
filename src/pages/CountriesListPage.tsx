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
import PublicIcon from '@mui/icons-material/Public'
import useMovieStore from '@/store/useMovieStore'
import SearchInput from '@/components/SearchInput'
import { useNavigate } from 'react-router-dom'
import { getCountryFlagUrl } from '@/utils/countryFlags'
import { ContinentShape } from '@/utils/continentIcons'
import LoadingIndicator from '@/components/LoadingIndicator'

import TableSortLabel from '@mui/material/TableSortLabel'

type SortKey = 'name' | 'movieCount' | 'directorCount'
type SortDirection = 'asc' | 'desc'

export default function CountriesListPage() {
    const countries = useMovieStore((s) => s.countries)
    const countryMetadata = useMovieStore((s) => s.countryMetadata)
    const countryIds = useMovieStore((s) => s.countryIds)
    const isLoading = useMovieStore((s) => s.isLoading)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchId, setSearchId] = useState<number | null>(null)
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

    const countriesList = useMemo(() => {
        const list = countries.map((name) => {
            const metadata = countryMetadata[name]
            return {
                id: countryIds[name] || 0,
                name: name,
                movieCount: metadata?.totalFilm || 0,
                directorCount: metadata?.totalPerson || 0,
                continent: metadata?.continent,
                isoCode: metadata?.isoCode
            }
        })

        const norm = (s: string) =>
            s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        const filtered = list.filter((c) => {
            const matchesName = norm(c.name).includes(norm(searchTerm))
            const matchesId = searchId === null || c.id === searchId
            return matchesName && matchesId
        })

        return filtered.sort((a, b) => {
            let comparison = 0
            switch (sortKey) {
                case 'name':
                    comparison = a.name.localeCompare(b.name)
                    break
                case 'movieCount':
                    comparison = a.movieCount - b.movieCount
                    break
                case 'directorCount':
                    comparison = a.directorCount - b.directorCount
                    break
            }
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [countries, searchTerm, searchId, sortKey, sortDirection, countryIds, countryMetadata])

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <PublicIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h4">Paises</Typography>
            </Box>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar pais..."
                showIdSearch={true}
                idValue={searchId}
                onIdChange={setSearchId}
            />

            {isLoading ? (
                <LoadingIndicator />
            ) : isMobile ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {countriesList.map((country) => (
                        <Card
                            key={country.name}
                            elevation={0}
                            sx={{
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}
                        >
                            <CardActionArea onClick={() => navigate(`/country/${country.id}`)}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {country.isoCode ? (
                                                <Box
                                                    component="img"
                                                    src={getCountryFlagUrl(country.isoCode)}
                                                    alt={country.name}
                                                    sx={{
                                                        width: 24,
                                                        height: 'auto',
                                                        borderRadius: '3px',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                                    }}
                                                />
                                            ) : '🌐'}
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {country.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                        <Chip
                                            label={`${country.movieCount} películas`}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(229, 9, 20, 0.1)', color: 'primary.light' }}
                                        />
                                        <Chip
                                            label={`${country.directorCount} directores`}
                                            size="small"
                                            sx={{ backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'secondary.light' }}
                                        />
                                    </Box>
                                    {country.continent && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <ContinentShape continent={country.continent} size={16} />
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                {country.continent}
                                            </Typography>
                                        </Box>
                                    )}
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
                                <TableCell align="center">Continente</TableCell>
                                <TableCell align="center">Bandera</TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={sortKey === 'movieCount'}
                                        direction={sortKey === 'movieCount' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('movieCount')}
                                    >
                                        Cantidad Peliculas
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={sortKey === 'directorCount'}
                                        direction={sortKey === 'directorCount' ? sortDirection : 'asc'}
                                        onClick={() => handleSort('directorCount')}
                                    >
                                        Cantidad Directores
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countriesList.map((country) => (
                                <TableRow
                                    key={country.name}
                                    hover
                                    onClick={() => navigate(`/country/${country.id}`)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                            {country.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{country.name}</TableCell>
                                    <TableCell align="center">
                                        {country.continent && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <ContinentShape continent={country.continent} size={20} />
                                                <Typography variant="body2">{country.continent}</Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {country.isoCode ? (
                                            <Box
                                                component="img"
                                                src={getCountryFlagUrl(country.isoCode)}
                                                alt={country.name}
                                                sx={{
                                                    width: 30,
                                                    height: 'auto',
                                                    borderRadius: '3px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                                }}
                                            />
                                        ) : '🌐'}
                                    </TableCell>
                                    <TableCell align="center">{country.movieCount}</TableCell>
                                    <TableCell align="center">{country.directorCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    )
}
