import {
  DragDropContext,
  DropResult,
  OnDragEndResponder,
} from '@hello-pangea/dnd'
import React from 'react'
import { CategoriesEnum, Library } from './library'
import { Workspace } from './workspace'

const onDragEnd = (
  result: DropResult,
  taskStructure: any,
  setTaskStructure: (newTaskStructure: any) => void
) => {
  const { source, destination, draggableId } = result
  if (!destination) return
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return

  const type = draggableId.split('_')[0] as CategoriesEnum
  const name = draggableId.split('_')[1]

  const sourceWorkspace = source.droppableId.includes('workspace_')
  const sourceLibrary = source.droppableId.includes('library_')

  const destinationWorkspace = destination.droppableId.includes('workspace_')
  const destinationLibrary = destination.droppableId.includes('library_')

  if (destinationLibrary) return

  // Dropping from library to workspace in empty area
  if (
    destinationWorkspace &&
    sourceLibrary &&
    [
      CategoriesEnum.TASKS,
      CategoriesEnum.EVENTS,
      CategoriesEnum.ACTIONS,
    ].includes(type)
  ) {
    setTaskStructure([...taskStructure, { type: type, name: name }])
  }

  console.log('onDragEnd', result)
}

export const DndArea = () => {
  const [taskStructure, setTaskStructure] = React.useState<any>([])
  return (
    <DragDropContext
      onDragEnd={(r) => onDragEnd(r, taskStructure, setTaskStructure)}
    >
      <Library />
      <Workspace taskStructure={taskStructure} />
    </DragDropContext>
  )
}
