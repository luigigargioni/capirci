import styled from 'styled-components'
import { Layout } from 'antd'

export const LayoutHeader = styled(Layout.Header)`
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  background: white;
  top: 0;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

export const WrapperTitle = styled.a`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

export const LogoStyled = styled.img`
  width: 26px;
  height: auto;
  margin-right: 8px;
`

export const TitleStyled = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(p) => p.theme.colors.primary.main};
`
