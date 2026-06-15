import { useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
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

// Positions of digit slots in "HH:MM:SS"
// Index: 0,1 = hours  |  3,4 = minutes  |  6,7 = seconds
const DIGIT_SLOTS = [0, 1, 3, 4, 6, 7]
const COLON_POSITIONS = new Set([2, 5])

function toDisplay(val: string): string {
  const digits = (val || '00:00:00').replace(/\D/g, '').substring(0, 6).padEnd(6, '0')
  return `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}:${digits[4]}${digits[5]}`
}

function digitsOnly(display: string): string {
  return display.replace(/\D/g, '')
}

function nextSlot(pos: number): number {
  const next = DIGIT_SLOTS.find((s) => s > pos)
  return next ?? pos
}

function prevSlot(pos: number): number {
  const prev = [...DIGIT_SLOTS].reverse().find((s) => s < pos)
  return prev ?? pos
}

export default function DurationInput({ value, onChange, label = 'Duración', required }: DurationInputProps) {
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const display = toDisplay(value)

  // Keep cursor on a digit slot after every render
  useEffect(() => {
    const el = inputRef.current
    if (!el || document.activeElement !== el) return
    // Let the browser settle first
    const pos = el.selectionStart ?? 0
    const slot = COLON_POSITIONS.has(pos) ? nextSlot(pos) : pos
    el.setSelectionRange(slot, slot + 1)
  })

  const moveTo = (pos: number) => {
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos + 1)
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = inputRef.current
    if (!el) return
    const pos = el.selectionStart ?? 0
    const slot = COLON_POSITIONS.has(pos) ? nextSlot(pos) : pos

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      moveTo(prevSlot(slot))
      return
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      moveTo(nextSlot(slot))
      return
    }
    if (e.key === 'Tab') return // let tab work normally

    if (e.key === 'Backspace') {
      e.preventDefault()
      const d = digitsOnly(display)
      const digitIdx = DIGIT_SLOTS.indexOf(slot)
      if (digitIdx < 0) return
      const arr = d.split('')
      arr[digitIdx] = '0'
      const newDigits = arr.join('')
      const newDisplay = `${newDigits[0]}${newDigits[1]}:${newDigits[2]}${newDigits[3]}:${newDigits[4]}${newDigits[5]}`
      onChange(newDisplay)
      // Move cursor back
      const prev = prevSlot(slot)
      moveTo(prev)
      return
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      const d = digitsOnly(display)
      const digitIdx = DIGIT_SLOTS.indexOf(slot)
      if (digitIdx < 0) return
      const arr = d.split('')
      arr[digitIdx] = e.key
      const newDigits = arr.join('')
      const newDisplay = `${newDigits[0]}${newDigits[1]}:${newDigits[2]}${newDigits[3]}:${newDigits[4]}${newDigits[5]}`
      onChange(newDisplay)
      // Advance to next slot
      moveTo(nextSlot(slot))
      return
    }

    // Block everything else (letters, symbols, etc.)
    e.preventDefault()
  }

  const handleClick = () => {
    const el = inputRef.current
    if (!el) return
    const pos = el.selectionStart ?? 0
    const slot = COLON_POSITIONS.has(pos) ? nextSlot(pos) : pos
    moveTo(slot)
  }

  const handleFocus = () => {
    moveTo(DIGIT_SLOTS[0])
  }

  return (
    <FormControl fullWidth required={required}>
      <InputLabel shrink sx={{ backgroundColor: 'background.paper', px: 0.5 }}>
        {label}
      </InputLabel>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.75,
          height: 56,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          mt: '16px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}33`,
          },
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value={display}
          onChange={() => {/* controlled via keyDown */}}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onFocus={handleFocus}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: theme.palette.text.primary,
            fontSize: 16,
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            padding: 0,
            caretColor: theme.palette.primary.main,
          }}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
        />
      </Box>
      <FormHelperText>Horas : Minutos : Segundos</FormHelperText>
    </FormControl>
  )
}
