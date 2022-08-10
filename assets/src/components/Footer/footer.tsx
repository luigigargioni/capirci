import React from 'react'
import { WrapperFooter, Copyright } from './footer.style'

export const Footer = () => {
  const copyrightStartYear = 2022
  const copyrightEndYear =
    new Date().getFullYear() === copyrightStartYear
      ? ''
      : `-${new Date().getFullYear()}`

  const linkProject =
    'https://www.sciencedirect.com/science/article/abs/pii/S073658452100106X'
  const linkProfile = 'https://github.com/luigigargioni'
  const copyright = ` ©${copyrightStartYear}${copyrightEndYear} `

  return (
    <WrapperFooter>
      <Copyright>
        <a href={linkProject} target="_blank" rel="noreferrer">
          CAPIRCI
        </a>
        {copyright}
        <a href={linkProfile} target="_blank" rel="noreferrer">
          Luigi Gargioni
        </a>
      </Copyright>
    </WrapperFooter>
  )
}
