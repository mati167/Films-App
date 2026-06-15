import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { useNavigate, useLocation } from 'react-router-dom'
import useMovieStore from '@/store/useMovieStore'

interface BreadcrumbItem {
  label: string
  path?: string
}

export default function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const countryById = useMovieStore((s) => s.countryById)
  const genreById = useMovieStore((s) => s.genreById)
  const directorById = useMovieStore((s) => s.directorById)

  const segments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', path: '/films' }]

  if (segments[0] === 'country' && segments[1]) {
    const numId = Number(segments[1])
    const name = countryById[numId] || decodeURIComponent(segments[1])
    breadcrumbs.push({ label: 'Países', path: '/countries' })
    breadcrumbs.push({ label: name })
  } else if (segments[0] === 'director' && segments[1]) {
    const numId = Number(segments[1])
    const name = directorById[numId] || decodeURIComponent(segments[1])
    breadcrumbs.push({ label: 'Directores', path: '/directors' })
    breadcrumbs.push({ label: name })
  } else if (segments[0] === 'genre' && segments[1]) {
    const numId = Number(segments[1])
    const name = genreById[numId] || decodeURIComponent(segments[1])
    breadcrumbs.push({ label: 'Géneros', path: '/genres' })
    breadcrumbs.push({ label: name })
  }

  if (breadcrumbs.length <= 1) return null

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 1.5, backgroundColor: 'background.default' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
        aria-label="navegacion"
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1

          if (isLast) {
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: 'text.primary', fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            )
          }

          return (
            <Link
              key={index}
              component="button"
              variant="body2"
              underline="hover"
              sx={{
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => item.path && navigate(item.path)}
            >
              {index === 0 && <HomeIcon sx={{ fontSize: 16 }} />}
              {item.label}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}
