import React from 'react'
import logo from './logo.png'
import backgroundLogin from './backgroundLogin.png'

export const Logo = () => <img src={logo} alt="logo" width="30" style={{marginRight: '1rem'}}/>
export const LogoBackground = () => (
  <img src={backgroundLogin} alt="logo" width="100%" height="100%" />
)
