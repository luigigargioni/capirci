import styled from 'styled-components'

export const LibraryWrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
`

export const CategoriesWrapper = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: center;
`

export const ItemsWrapper = styled.div`
  flex: 2;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: center;
`

type CategoryItemProps = {
  readonly color: string
  readonly selected: boolean
}

export const CategoryItem = styled.div<CategoryItemProps>`
  background-color: ${(p) => (p.selected ? `${p.color}20` : p.color)};
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
  transition: background-color 0.2s linear;

  &:hover {
    background-color: ${(p) => (p.selected ? `${p.color}20` : `${p.color}80`)};
    cursor: ${(p) => (p.selected ? 'default' : 'pointer')};
  }
`

type ItemsProps = {
  readonly color: string
  readonly isDragging: boolean
}

export const LibraryItem = styled.div<ItemsProps>`
  background-color: ${(p) => p.color};
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
  transition: background-color 0.2s linear;

  &:hover {
    cursor: grab;
    background-color: ${(p) => `${p.color}80`};
  }

  & span {
    position: absolute;
    right: 1rem;
  }
`

export const CloneLibraryItem = styled(LibraryItem)`
  transform: none;
  background: ${(p) => `${p.color}80`};
`

export const ScrollableWrapper = styled.div`
  display: flex;
  min-height: min-content;
  flex-direction: column;
  align-items: center;
`
