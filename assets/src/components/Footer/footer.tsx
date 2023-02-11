import { Typography } from 'antd'
import React from 'react'
import { inherits } from 'util'
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
        <Typography.Link
          href={linkProject}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 'inherit' }}
        >
          CAPIRCI
        </Typography.Link>
        {copyright}
        <Typography.Link
          href={linkProfile}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 'inherit' }}
        >
          Luigi Gargioni
        </Typography.Link>
      </Copyright>
    </WrapperFooter>
  )
}
