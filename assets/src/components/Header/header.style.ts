import styled from 'styled-components'
import { Layout } from 'antd'

export const LayoutHeader = styled(Layout.Header)`
  width: 100%;
  height: 36px;
  background: white;
  // position: absolute;
  top: 0;
  box-shadow: 0 1px 9px -3px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;

  & > a {
    margin-left: 2rem;
    margin-top: 4px;

    :hover {
      & > span {
        color: ${(p) => p.theme.colors.primary.main};
      }
    }
  }
`
