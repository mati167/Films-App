import { createTheme, PaletteMode } from '@mui/material/styles'

export const getTheme = (mode: PaletteMode) => {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#E50914',
        light: '#FF3D47',
        dark: '#B2070F',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#1DB954',
        light: '#4ECB71',
        dark: '#168F40',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#0A0A0F' : '#F9F9FB',
        paper: isDark ? '#12121A' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F0F0F5' : '#111827',
        secondary: isDark ? '#9CA3AF' : '#6B7280',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: 'rgba(229, 9, 20, 0.08)',
        selected: 'rgba(229, 9, 20, 0.12)',
      },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.9375rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@media (max-width: 768px)': {
            '.MuiTouchRipple-root': {
              display: 'none !important',
            },
          },
          body: {
            scrollbarColor: isDark ? '#2A2A35 #0A0A0F' : '#D1D5DB #F3F4F6',
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: isDark ? '#0A0A0F' : '#F3F4F6',
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDark ? '#2A2A35' : '#D1D5DB',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: isDark ? '#3A3A45' : '#9CA3AF',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              backgroundColor: isDark ? '#1A1A25' : '#F3F4F6',
              color: isDark ? '#9CA3AF' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            },
            '&:last-child td': {
              borderBottom: 0,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.04)',
            padding: '12px 16px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  })
}

export default getTheme('dark')

