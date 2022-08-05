import React from 'react'
import { WrapperFooter, Copyright } from './footer.style'

interface FooterProps {
  copyright: string
}

export const Footer = (p: FooterProps) => (
  <WrapperFooter>
    <Copyright>{p.copyright}</Copyright>
  </WrapperFooter>
)
