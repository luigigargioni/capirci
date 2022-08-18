import styled from 'styled-components'

export const LibraryWrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
`

export const CategoriesWrapper = styled.div`
  margin-left: 1rem;
  margin-right: 3rem;
`

export const ItemsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadein 0.5s;
`

type CategoryProps = {
  readonly color: string
  readonly selected: boolean
}

export const Category = styled.div<CategoryProps>`
  background: ${(p) => (p.selected ? `${p.color}20` : p.color)};
  border: 2px solid ${(p) => p.color};
  margin-top: 1rem;
  height: 4rem;
  width: 9rem;
  border-radius: 10px;
  color: ${(p) => (p.selected ? p.color : 'white')};
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${(p) => (p.selected ? `${p.color}20` : `${p.color}80`)};
    cursor: ${(p) => (p.selected ? 'default' : 'pointer')};
  }
`

type ItemsProps = {
  readonly color: string
  readonly isDragging: boolean
}

export const LibraryItem = styled.div<ItemsProps>`
  background: ${(p) => p.color};
  border: ${({ isDragging }) => (isDragging ? '2px' : '0px')} dashed
    ${({ theme }) => theme.colors.neutral.gray7};
  margin-top: 1rem;
  width: 15rem;
  color: white;
  height: 3rem;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  user-select: none;

  &:hover {
    cursor: grab;
    background: ${(p) => `${p.color}80`};
  }
`

export const CloneLibraryItem = styled(LibraryItem)`
  transform: none;
  background: ${(p) => `${p.color}80`};
`
