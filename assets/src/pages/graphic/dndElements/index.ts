import styled from 'styled-components'
import { CategoriesColorEnum } from '../library'

type StyledDndItemProps = {
  readonly color: CategoriesColorEnum
}

// For Objects, Locations and Events
export const StyledDndItem = styled.div<StyledDndItemProps>`
  border-radius: 10px;
  background-color: ${({ color }) => color};
  color: white;
  border: 1px solid white;
  height: 20px;
`
