import styled from 'styled-components'

export const GraphicWrapper = styled.div`
  height: calc(100% - ${({ theme }) => theme.headerHeight});
  display: flex;
`
