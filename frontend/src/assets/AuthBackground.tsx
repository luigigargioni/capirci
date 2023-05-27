import React from 'react'
import { Box } from '@mui/material'

import { LogoBackground } from 'components/Logo/Logo'

export const AuthBackground = () => (
  <Box
    sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}
  >
    <LogoBackground />
  </Box>
)
