import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from '@hello-pangea/dnd'
import React from 'react'
import { useAppSelector } from '../../redux'
import {
  resetDraggingType,
  setDraggingType,
  setTaskStructure,
} from '../../redux/graphic'
import { store } from '../../store'
import { CategoriesEnum, Library } from './library'
import {
  getDraggingName,
  getDraggingType,
  isDestinationLibrary,
  isDestinationWorkspace,
  isSourceLibrary,
} from './util'
import { Workspace } from './workspace'

const onDragStart = (result: DragStart) => {
  console.log('onDragStart', result)

  const { draggableId } = result
  const type = getDraggingType(draggableId)
  store.dispatch(setDraggingType(type))
}

const onDragUpdate = (result: DragUpdate) => {
  console.log('onDragUpdate', result)
}

const onDragEnd = (result: DropResult, taskStructure: any) => {
  const { source, destination, draggableId } = result

  store.dispatch(resetDraggingType())

  if (!destination) return
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return

  const type = getDraggingType(draggableId)
  const name = getDraggingName(draggableId)

  if (isDestinationLibrary(destination)) return

  const newTaskStructure = [...taskStructure, { type: type, name: name }]
  store.dispatch(setTaskStructure(newTaskStructure))

  console.log('onDragEnd', result)
}

export const DndArea = () => {
  const taskStructure = useAppSelector(({ graphic }) => graphic.taskStructure)
  return (
    <DragDropContext
      onDragEnd={(r) => onDragEnd(r, taskStructure)}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      <Library />
      <Workspace />
    </DragDropContext>
  )
}
