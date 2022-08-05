import React from 'react'
import { SiderMenu } from '../SiderMenu'
import {
  MenuContainer,
  Brand,
  Logo,
  LayoutSider,
  LogoSvgStyled,
} from './sider.style'
// import LogoSvg from '../../../../assets/img/logo.svg'

interface SiderProps {
  collapsed: boolean
  onCollapseChange(collapsed: boolean): void
  username: string
}

export const Sider = (p: SiderProps) => (
  <LayoutSider
    width={256}
    theme="light"
    trigger={null}
    collapsible
    defaultCollapsed
    collapsed={p.collapsed}
  >
    <Brand onClick={() => p.onCollapseChange(!p.collapsed)}>
      <Logo>
        {/* <LogoSvgStyled src={LogoSvg} /> */}
        {!p.collapsed && <h1>Gestionale FP</h1>}
      </Logo>
    </Brand>

    <MenuContainer>
      <SiderMenu username={p.username} />
    </MenuContainer>
  </LayoutSider>
)
