import React from 'react'
import { Link } from 'react-router-dom'
import { ButtonBase, Typography } from '@mui/material'

import { defaultPath } from 'utils/constants'
import { Logo } from './Logo'

export const LogoSection = () => (
  <ButtonBase disableRipple component={Link} to={defaultPath} disabled>
    <Logo />
    <Typography key="logo">CapricciDiDama</Typography>
  </ButtonBase>
)
