import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImdb, faLetterboxd } from '@fortawesome/free-brands-svg-icons'

interface ExternalLinksProps {
  movieName: string
  movieYear: number
  imdbID?: string
  imdbUrl?: string
  letterboxdUrl?: string
}

export default function ExternalLinks({
  movieName,
  movieYear,
  imdbID,
  imdbUrl: propImdbUrl,
  letterboxdUrl: propLbUrl,
}: ExternalLinksProps) {
  const imdbUrl = imdbID
    ? `https://www.imdb.com/title/${imdbID}/`
    : (propImdbUrl || `https://www.imdb.com/find?q=${encodeURIComponent(`${movieName} ${movieYear}`)}`)

  const lbUrl = imdbID
    ? `https://letterboxd.com/imdb/${imdbID}/`
    : (propLbUrl || `https://letterboxd.com/search/${encodeURIComponent(`${movieName} ${movieYear}`)}/`)

  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      <Tooltip title="Ver en IMDb" arrow>
        <IconButton
          href={imdbUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            color: '#F5C518',
            '&:hover': {
              backgroundColor: 'rgba(245, 197, 24, 0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <FontAwesomeIcon icon={faImdb} size="sm" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ver en Letterboxd" arrow>
        <IconButton
          href={lbUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            color: '#00D735',
            '&:hover': {
              backgroundColor: 'rgba(0, 215, 53, 0.1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s',
          }}
        >
          <FontAwesomeIcon icon={faLetterboxd} size="sm" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

