import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from '@hello-pangea/dnd'
import { nanoid } from 'nanoid'
import React from 'react'
import { useAppSelector } from '../../redux'
import {
  resetDraggingType,
  setDraggingType,
  setTaskStructure,
} from '../../redux/graphic'
import { store } from '../../store'
import {
  ActionInterface,
  ControlInterface,
  DndItemInterface,
  EventInterface,
  LocationInterface,
  ObjectInterface,
  RootDndInterface,
} from './dndElements'
import {
  CategoriesEnum,
  ControlsValuesEnum,
  EventsValuesEnum,
  Library,
} from './library'
import {
  getItemId,
  getItemName,
  getItemCategory,
  isDestinationLibrary,
  isSourceLibrary,
  isSourceWorkspace,
  getItemType,
} from './util'
import { Workspace } from './workspace'

const insertNewElementRec = (
  id: string,
  currentNode: DndItemInterface,
  newItem: any,
  destionationType: string | undefined
): void => {
  if (id === currentNode.id) {
    if ('items' in currentNode && destionationType === 'items') {
      currentNode.items.push(newItem)
      return
    }
    // eslint-disable-next-line no-param-reassign
    currentNode[destionationType] = newItem
  }

  // Use a for loop instead of forEach to avoid nested functions
  // Otherwise "return" will not work properly
  if ('items' in currentNode) {
    for (let i = 0; i < currentNode.items.length; i += 1) {
      // Search in the current child
      insertNewElementRec(id, currentNode.items[i], newItem, destionationType)
    }
  }
}

const insertNewElement = (
  newItem: DndItemInterface,
  taskStructure: RootDndInterface,
  destionationId: string,
  destionationType: string | undefined
): void => {
  taskStructure.forEach((taskStructureItem) => {
    insertNewElementRec(
      destionationId,
      taskStructureItem,
      newItem,
      destionationType
    )
  })
}

const onDragStart = (result: DragStart) => {
  console.log('onDragStart', result)
  const { draggableId } = result
  const type = getItemCategory(draggableId)
  store.dispatch(setDraggingType(type))
}

const onDragUpdate = (result: DragUpdate) => {
  console.log('onDragUpdate', result)
}

const onDragEnd = (result: DropResult, taskStructure: RootDndInterface) => {
  console.log('onDragEnd', result)
  const { source, destination, draggableId } = result

  store.dispatch(resetDraggingType())

  // Dragged outside the DroppableArea
  if (!destination) return

  // Dragged inside the same DroppableArea and not moved
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return

  // Dragged to the Library
  if (isDestinationLibrary(destination)) return

  const category = getItemCategory(draggableId)
  const name = getItemName(draggableId)

  // Added from the Library
  if (isSourceLibrary(source)) {
    const newId = nanoid()

    let newItem: DndItemInterface = null

    switch (category) {
      case CategoriesEnum.CONTROLS:
        newItem = {
          id: newId,
          name: name,
          category: CategoriesEnum.CONTROLS,
          items: [],
          ...([
            ControlsValuesEnum.DO_WHEN,
            ControlsValuesEnum.WHEN,
            ControlsValuesEnum.STOP_WHEN,
          ].includes(name as ControlsValuesEnum) && { event: null }),
          ...(name === ControlsValuesEnum.REPEAT && { iteration: 1 }),
        } as ControlInterface
        break
      case CategoriesEnum.EVENTS:
        newItem = {
          id: newId,
          name: name,
          category: CategoriesEnum.EVENTS,
          ...(name === EventsValuesEnum.FIND && { object: null }),
        } as EventInterface
        break
      case CategoriesEnum.ACTIONS:
        newItem = {
          id: newId,
          name: name,
          category: CategoriesEnum.ACTIONS,
          object: null,
        } as ActionInterface
        break
      case CategoriesEnum.OBJECTS:
        newItem = {
          id: newId,
          name: name,
          category: CategoriesEnum.OBJECTS,
        } as ObjectInterface
        break
      case CategoriesEnum.LOCATIONS:
        newItem = {
          id: newId,
          name: name,
          category: CategoriesEnum.LOCATIONS,
        } as LocationInterface
        break
      default:
        break
    }

    // Workspace is empty
    if (taskStructure.length === 0) {
      if (
        newItem.category === CategoriesEnum.CONTROLS ||
        newItem.category === CategoriesEnum.ACTIONS
      )
        store.dispatch(setTaskStructure([newItem]))
      return
    }

    const destinationId = getItemId(destination.droppableId)
    const destionationType = getItemType(destination.droppableId)
    const newTaskStructure = [...taskStructure]
    insertNewElement(newItem, newTaskStructure, destinationId, destionationType)
    store.dispatch(setTaskStructure(newTaskStructure))
    return
  }

  // Moved inside the Workspace
  if (isSourceWorkspace(source)) {
    const id = getItemId(draggableId)
  }
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
