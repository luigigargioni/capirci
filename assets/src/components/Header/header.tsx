import React from 'react'
import {
  LayoutHeader,
  LogoStyled,
  TitleStyled,
  WrapperTitle,
} from './header.style'
import Logo from '../../img/logo.png'

export const Header = () => (
  <LayoutHeader>
    <WrapperTitle href="/">
      <LogoStyled src={Logo} alt="Logo" />
      <TitleStyled>CAPIRCI</TitleStyled>
    </WrapperTitle>
  </LayoutHeader>
)
