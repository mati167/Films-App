import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import SvgIcon from '@mui/material/SvgIcon'

// La interfaz se define abajo junto al componente

function ImdbIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="currentColor"
        d="M14.31 9.588v4.84h-1.09V9.588h1.09ZM2 7.003h2.04l.6 4.112.6-4.112H7.3v9.994H5.71v-6.39l-.9 6.39H3.47l-.87-6.39v6.39H1.01L2 7.003Zm6.34 0h2.94c.9 0 1.55.46 1.55 1.61v6.77c0 1.15-.65 1.61-1.55 1.61H8.34V7.003Zm1.54 1.32v7.35h.73c.37 0 .54-.15.54-.52V8.85c0-.37-.17-.52-.54-.52h-.73Zm7.2-1.32h2.47c1.17 0 1.67.67 1.67 1.7v2.37c0 1.17-.67 1.45-1.27 1.52.73.08 1.27.39 1.27 1.48v2.6c0 .57.04.88.22 1.29h-1.56c-.1-.24-.17-.48-.17-1.13v-2.5c0-.76-.22-1-.72-1h-.37v4.63h-1.55V7.003Zm1.55 1.39v3.16h.47c.43 0 .72-.17.72-.74V9.15c0-.57-.2-.76-.64-.76h-.55Z"
      />
    </SvgIcon>
  )
}

function RottenTomatoesIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 3c.55 0 1.08.09 1.58.26-.18.22-.3.49-.3.79 0 .69.56 1.25 1.25 1.25.3 0 .57-.12.79-.3.17.5.26 1.03.26 1.58 0 2.49-1.79 4.5-4 4.5S6.08 11.07 6.08 8.58c0-2.21 2.01-4 4.42-4zM12 20c-3.17 0-5.96-1.86-7.24-4.55C6.55 14.01 9.13 13 12 13s5.45 1.01 7.24 2.45C17.96 18.14 15.17 20 12 20z"
      />
    </SvgIcon>
  )
}

function LetterboxdIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="currentColor"
        d="M8.224 14.352a4.473 4.473 0 0 1-1.2-3.052c0-1.2.466-2.263 1.2-3.052A4.473 4.473 0 0 0 7.025 12c0 1.2.466 2.263 1.2 3.052zM12 15.6a4.445 4.445 0 0 1-2.576-.824 5.605 5.605 0 0 0 1.376-2.776h2.4a5.605 5.605 0 0 0 1.376 2.776A4.445 4.445 0 0 1 12 15.6zm0-7.2c.944 0 1.82.297 2.576.824a5.605 5.605 0 0 0-1.376 2.776h-2.4a5.605 5.605 0 0 0-1.376-2.776A4.445 4.445 0 0 1 12 8.4zm3.776 5.952a4.473 4.473 0 0 0 1.2-3.052 4.473 4.473 0 0 0-1.2-3.052 4.473 4.473 0 0 1 1.2 3.052c0 1.2-.466 2.263-1.2 3.052zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      />
    </SvgIcon>
  )
}

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
  // 1. IMDb Link: Prioridad ID > URL > Search
  const imdbUrl = imdbID
    ? `https://www.imdb.com/title/${imdbID}/`
    : (propImdbUrl || `https://www.imdb.com/find?q=${encodeURIComponent(`${movieName} ${movieYear}`)}`)

  // 2. Letterboxd: Prioridad IMDb ID > URL > Search
  // Nota: Letterboxd soporta /imdb/<id> para redirección directa
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
          <ImdbIcon />
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
          <LetterboxdIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
