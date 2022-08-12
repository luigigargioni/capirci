import React from 'react'
import { WorkspaceWrapper } from './workspace.style'
import { useDrop } from 'react-dnd'
import { CategoriesEnum } from './library'

export const Workspace = () => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: CategoriesEnum.TASKS,
      drop: () => ({ name: 'Workspace' }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  )

  console.log('options', { canDrop, isOver })
  return <WorkspaceWrapper ref={drop} />
}
