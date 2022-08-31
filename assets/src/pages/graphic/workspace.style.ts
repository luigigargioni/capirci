import styled from 'styled-components'

export const WorkspaceWrapper = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 1rem 1rem 1rem;
`

export const TaskInfo = styled.div`
  width: 100%;
  height: 3rem;
  font-weight: bold;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.neutral.gray8};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

type DroppableWorkspaceAreaProps = {
  readonly isEmpty: boolean
  readonly isDraggingOver: boolean
}

export const DroppableWorkspaceArea = styled.div<DroppableWorkspaceAreaProps>`
  border: ${({ isDraggingOver }) => (isDraggingOver ? '4px' : '2px')} dashed
    ${({ theme }) => theme.colors.neutral.gray7};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  font-size: ${({ isEmpty }) => (isEmpty ? '5rem' : '1rem')};
  color: ${({ isEmpty, isDraggingOver, theme }) =>
    isEmpty
      ? isDraggingOver
        ? theme.colors.neutral.gray6
        : theme.colors.neutral.gray7
      : 'inherit'};
  background-color: ${({ isDraggingOver, theme }) =>
    isDraggingOver && theme.colors.primary.light4};
  transition: background-color 0.2s linear;
`

type WrapperTrashProps = {
  readonly isVisible: boolean
  readonly isDraggingOver: boolean
}

export const WrapperTrash = styled.div<WrapperTrashProps>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  display: flex;
  border: 2px dashed ${({ theme }) => theme.colors.contextual.error.main};
  flex: 1;
  margin: 0 5rem;
  color: ${({ theme }) => theme.colors.contextual.error.main};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  height: 80%;
  background-color: ${({ theme, isDraggingOver }) =>
    isDraggingOver
      ? theme.colors.contextual.error.light3
      : theme.colors.contextual.error.light4};
  transition: background-color 0.2s linear;
`
