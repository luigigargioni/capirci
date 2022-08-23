import styled from 'styled-components'
import { Layout } from 'antd'
// import SVG from 'react-inlinesvg'

export const LayoutSider = styled(Layout.Sider)`
  height: 100%;
  position: absolute;
  z-index: 3;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, 0.2);
`

export const Brand = styled.div`
  z-index: 1;
  cursor: pointer;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, 0.2);
`
/*
export const LogoSvgStyled = styled(SVG)`
  width: 2.25rem;
  margin-left: 10px;
  margin-right: 8px;
`
*/

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    vertical-align: text-bottom;
    font-size: 16px;
    text-transform: uppercase;
    display: inline-block;
    font-weight: 700;
    color: ${(p) => p.theme.colors.primary.main};
    white-space: nowrap;
    margin-bottom: 0;
    animation: fadeRightIn 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
    animation-fill-mode: both;
  }
`

export const MenuContainer = styled.div`
  height: calc(100% - 72px);
  padding: 1rem 0;
  overflow: auto;

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: unset;
  }
`
