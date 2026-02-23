import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'

import { SxProps, Theme } from '@mui/material/styles'

interface ChipLinkProps {
  label: string
  to: string
  color?: 'default' | 'primary' | 'secondary'
  variant?: 'filled' | 'outlined'
  sx?: SxProps<Theme>
}

export default function ChipLink({
  label,
  to,
  color = 'default',
  variant = 'outlined',
  sx,
}: ChipLinkProps) {
  const navigate = useNavigate()

  return (
    <Chip
      label={label}
      size="small"
      color={color}
      variant={variant}
      clickable
      onClick={() => navigate(to)}
      sx={{
        mr: 0.5,
        mb: 0.5,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(229, 9, 20, 0.2)',
        },
        ...sx,
      }}
    />
  )
}
