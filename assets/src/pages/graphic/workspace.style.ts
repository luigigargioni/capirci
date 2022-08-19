import styled from 'styled-components'

export const WorkspaceWrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TaskInfo = styled.div`
  position: absolute;
  top: 4rem;
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
  position: absolute;
  height: 80%;
  width: 60%;
  font-size: ${({ isEmpty }) => (isEmpty ? '10rem' : '1rem')};
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
