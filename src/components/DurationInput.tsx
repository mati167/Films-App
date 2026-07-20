import { useRef, forwardRef } from 'react'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'

interface DurationInputProps {
  value: string          // "HH:MM:SS"
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

// Positions of digit slots in "HH:MM:SS"
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
  return DIGIT_SLOTS.find((s) => s > pos) ?? pos
}

function prevSlot(pos: number): number {
  return [...DIGIT_SLOTS].reverse().find((s) => s < pos) ?? pos
}

// The actual masked <input> element forwarded by TextField
interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ownerState?: unknown
  inputRef?: React.Ref<HTMLInputElement>
  onChangeMasked: (v: string) => void
  display: string
  theme: ReturnType<typeof useTheme>
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ onChangeMasked, display, theme, ...rest }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)

    const moveTo = (pos: number) => {
      requestAnimationFrame(() => {
        const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? innerRef.current
        el?.setSelectionRange(pos, pos + 1)
      })
    }

    const handleFocus = () => moveTo(DIGIT_SLOTS[0])

    const handleClick = () => {
      const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? innerRef.current
      if (!el) return
      const pos = el.selectionStart ?? 0
      const slot = COLON_POSITIONS.has(pos) ? nextSlot(pos) : pos
      moveTo(slot)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const el = (ref as React.RefObject<HTMLInputElement>)?.current ?? innerRef.current
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
      if (e.key === 'Tab') return

      if (e.key === 'Backspace') {
        e.preventDefault()
        const d = digitsOnly(display)
        const digitIdx = DIGIT_SLOTS.indexOf(slot)
        if (digitIdx < 0) return
        const arr = d.split('')
        arr[digitIdx] = '0'
        const nd = arr.join('')
        onChangeMasked(`${nd[0]}${nd[1]}:${nd[2]}${nd[3]}:${nd[4]}${nd[5]}`)
        moveTo(prevSlot(slot))
        return
      }

      if (/^\d$/.test(e.key)) {
        e.preventDefault()
        const d = digitsOnly(display)
        const digitIdx = DIGIT_SLOTS.indexOf(slot)
        if (digitIdx < 0) return
        const arr = d.split('')
        arr[digitIdx] = e.key
        const nd = arr.join('')
        onChangeMasked(`${nd[0]}${nd[1]}:${nd[2]}${nd[3]}:${nd[4]}${nd[5]}`)
        moveTo(nextSlot(slot))
        return
      }

      e.preventDefault()
    }

    return (
      <input
        {...rest}
        ref={(node) => {
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
        }}
        value={display}
        onChange={() => {/* controlled via keyDown */}}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        style={{
          fontFamily: 'monospace',
          letterSpacing: '0.18em',
        }}
      />
    )
  }
)
MaskedInput.displayName = 'MaskedInput'

export default function DurationInput({ value, onChange, label = 'Duración', required }: DurationInputProps) {
  const theme = useTheme()
  const display = toDisplay(value)

  return (
    <TextField
      label={label}
      required={required}
      fullWidth
      value={display}
      onChange={() => {/* controlled */}}
      helperText="Horas : Minutos : Segundos"
      slotProps={{
        input: {
          inputComponent: MaskedInput as React.ElementType,
          inputProps: {
            onChangeMasked: onChange,
            display,
            theme,
          },
        },
      }}
    />
  )
}
