import { useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useTheme } from '@mui/material/styles'

interface DurationInputProps {
  value: string          // "HH:MM:SS"
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

function pad(n: string) {
  return n.padStart(2, '0')
}

function clamp(val: number, max: number) {
  return Math.min(val, max)
}

export default function DurationInput({ value, onChange, label = 'Duración', required }: DurationInputProps) {
  const theme = useTheme()
  const refH = useRef<HTMLInputElement>(null)
  const refM = useRef<HTMLInputElement>(null)
  const refS = useRef<HTMLInputElement>(null)

  // Parse value into parts
  const parts = (value || '00:00:00').split(':')
  const hVal = parts[0] ?? '00'
  const mVal = parts[1] ?? '00'
  const sVal = parts[2]?.substring(0, 2) ?? '00'

  // Internal display strings
  const [hDisplay, setHDisplay] = useState(pad(hVal))
  const [mDisplay, setMDisplay] = useState(pad(mVal))
  const [sDisplay, setSDisplay] = useState(pad(sVal))
  const [focused, setFocused] = useState(false)

  // Sync from external value changes (e.g. initial load)
  useEffect(() => {
    const p = (value || '00:00:00').split(':')
    setHDisplay(pad(p[0] ?? '00'))
    setMDisplay(pad(p[1] ?? '00'))
    setSDisplay(pad((p[2] ?? '00').substring(0, 2)))
  }, [value])

  const emit = (h: string, m: string, s: string) => {
    onChange(`${pad(h)}:${pad(m)}:${pad(s)}`)
  }

  const handleSegment = (
    raw: string,
    max: number,
    setter: (v: string) => void,
    current: string,
    nextRef: React.RefObject<HTMLInputElement | null> | null,
    emitWith: (v: string) => void
  ) => {
    // Only allow digits
    const digits = raw.replace(/\D/g, '')
    if (digits === '') {
      setter('00')
      emitWith('00')
      return
    }

    // Build new value: append digit to last char of current display, keep last 2
    const pending = (current.replace(/^0+/, '') + digits).slice(-2)
    const numVal = clamp(parseInt(pending, 10) || 0, max)
    const display = pad(String(numVal))
    setter(display)
    emitWith(display)

    // Auto-advance when 2 digits typed and next exists
    if (pending.length >= 2 && nextRef?.current) {
      nextRef.current.focus()
      nextRef.current.select()
    }
  }

  const borderColor = focused
    ? theme.palette.primary.main
    : theme.palette.divider

  const inputStyle: React.CSSProperties = {
    width: 36,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: theme.palette.text.primary,
    fontSize: 16,
    fontFamily: 'inherit',
    textAlign: 'center',
    padding: 0,
    caretColor: theme.palette.primary.main,
  }

  return (
    <FormControl fullWidth required={required}>
      <InputLabel shrink sx={{ backgroundColor: 'background.paper', px: 0.5 }}>
        {label}
      </InputLabel>
      <Box
        onClick={() => refH.current?.focus()}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          px: 1.5,
          height: 56,
          border: '1px solid',
          borderColor: focused ? 'primary.main' : 'divider',
          borderRadius: 1,
          cursor: 'text',
          transition: 'border-color 0.2s',
          boxShadow: focused ? `0 0 0 2px ${theme.palette.primary.main}22` : 'none',
          mt: '16px',
        }}
      >
        {/* Hours */}
        <input
          ref={refH}
          style={inputStyle}
          value={hDisplay}
          onFocus={(e) => { setFocused(true); e.target.select() }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              setHDisplay('00')
              emit('00', mDisplay, sDisplay)
            }
            if (e.key === 'ArrowRight') { refM.current?.focus(); refM.current?.select() }
          }}
          onChange={(e) =>
            handleSegment(e.target.value, 99, setHDisplay, hDisplay, refM, (v) => emit(v, mDisplay, sDisplay))
          }
          maxLength={2}
          inputMode="numeric"
        />

        <Typography sx={{ color: 'text.secondary', fontWeight: 700, userSelect: 'none', mx: 0.25 }}>:</Typography>

        {/* Minutes */}
        <input
          ref={refM}
          style={inputStyle}
          value={mDisplay}
          onFocus={(e) => { setFocused(true); e.target.select() }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              setMDisplay('00')
              emit(hDisplay, '00', sDisplay)
            }
            if (e.key === 'ArrowLeft') { refH.current?.focus(); refH.current?.select() }
            if (e.key === 'ArrowRight') { refS.current?.focus(); refS.current?.select() }
          }}
          onChange={(e) =>
            handleSegment(e.target.value, 59, setMDisplay, mDisplay, refS, (v) => emit(hDisplay, v, sDisplay))
          }
          maxLength={2}
          inputMode="numeric"
        />

        <Typography sx={{ color: 'text.secondary', fontWeight: 700, userSelect: 'none', mx: 0.25 }}>:</Typography>

        {/* Seconds */}
        <input
          ref={refS}
          style={inputStyle}
          value={sDisplay}
          onFocus={(e) => { setFocused(true); e.target.select() }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              setSDisplay('00')
              emit(hDisplay, mDisplay, '00')
            }
            if (e.key === 'ArrowLeft') { refM.current?.focus(); refM.current?.select() }
          }}
          onChange={(e) =>
            handleSegment(e.target.value, 59, setSDisplay, sDisplay, null, (v) => emit(hDisplay, mDisplay, v))
          }
          maxLength={2}
          inputMode="numeric"
        />
      </Box>
      <FormHelperText>Horas : Minutos : Segundos</FormHelperText>
    </FormControl>
  )
}
