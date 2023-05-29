import React from 'react'
import { devServerUrl } from 'utils/constants'

export const Logo = () => <img src={`${devServerUrl}/src/components/Logo/logo.png`} alt="logo" width="30" style={{marginRight: '1rem'}}/>
export const LogoBackground = () => (
  <img src={`${devServerUrl}/src/components/Logo/backgroundLogin.png`} alt="logo" width="100%" height="100%" />
)
