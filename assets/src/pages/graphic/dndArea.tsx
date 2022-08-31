import {
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from '@hello-pangea/dnd'
import { nanoid } from 'nanoid'
import { Item } from 'rc-menu'
import React from 'react'
import { useAppSelector } from '../../redux'
import {
  resetDraggingType,
  setDraggingType,
  setSourceLibrary,
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
  isDestinationWorkspace,
  isDestinationTrash,
} from './util'
import { Workspace } from './workspace'

const insertNewElement = (
  currentNode: DndItemInterface,
  newItem: any,
  destinationId: string,
  destionationType: string | undefined,
  destinationIndex: number
): DndItemInterface => {
  if (destinationId === currentNode.id) {
    if (
      currentNode.category === CategoriesEnum.CONTROLS &&
      destionationType === 'items'
    ) {
      if (currentNode.items.length === 0)
        return { ...currentNode, items: [newItem] }

      const newItems = [...currentNode.items]
      newItems.splice(destinationIndex, 0, newItem)
      return { ...currentNode, items: newItems }
    }
    // Event in Control or Object in Action
    const newNode = { ...currentNode, [destionationType]: newItem }
    return newNode
  }

  if (
    currentNode.category === CategoriesEnum.CONTROLS &&
    currentNode.items.length > 0
  ) {
    const newItems = currentNode.items.map(
      (item: ControlInterface | ActionInterface) =>
        insertNewElement(
          item,
          newItem,
          destinationId,
          destionationType,
          destinationIndex
        )
    )
    const newNode = { ...currentNode, items: newItems } as DndItemInterface
    return newNode
  }

  return currentNode
}

const deleteElement = (
  currentNode: (ControlInterface | ActionInterface)[] | DndItemInterface[],
  elementId: string
): DndItemInterface[] => {
  const newStructure = currentNode
    .filter((item: DndItemInterface) => item.id !== elementId)
    .map((item: DndItemInterface) => {
      // Items in Control
      if (item.category === CategoriesEnum.CONTROLS && item.items.length > 0) {
        const newItem = {
          ...item,
          items: deleteElement(item.items, elementId),
        } as ControlInterface
        return newItem
      }

      // Event in Control
      if (item.category === CategoriesEnum.CONTROLS && item.event) {
        if (item.event.id === elementId) {
          const newItem = { ...item, event: null } as ControlInterface
          return newItem
        }
      }

      // Object in Find Event
      if (
        item.category === CategoriesEnum.EVENTS &&
        item.name === EventsValuesEnum.FIND
      ) {
        if (item.object.id === elementId) {
          const newItem = { ...item, object: null } as EventInterface
          return newItem
        }
      }

      // Object/Location in Action
      if (item.category === CategoriesEnum.ACTIONS) {
        if (item.object.id === elementId) {
          const newItem = { ...item, object: null } as ActionInterface
          return newItem
        }
      }

      return item
    })

  return newStructure
}

const onDragStart = (result: DragStart) => {
  console.log('onDragStart', result)
  const { draggableId, source } = result
  const type = getItemCategory(draggableId)
  store.dispatch(setDraggingType(type))
  store.dispatch(setSourceLibrary(isSourceLibrary(source)))
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

    // Destination is Workspace
    if (isDestinationWorkspace(destination)) {
      if (
        newItem.category === CategoriesEnum.CONTROLS ||
        newItem.category === CategoriesEnum.ACTIONS
      ) {
        if (taskStructure.length === 0)
          store.dispatch(setTaskStructure([newItem]))
        else {
          const newTaskStructure = [...taskStructure]
          newTaskStructure.splice(destination.index, 0, newItem)
          store.dispatch(setTaskStructure(newTaskStructure))
        }
        return
      }
    }

    // Insert new item in the destination item
    const destinationId = getItemId(destination.droppableId)
    const destionationType = getItemType(destination.droppableId)
    const newTaskStructure = taskStructure.map(
      (taskStructureItem) =>
        insertNewElement(
          taskStructureItem,
          newItem,
          destinationId,
          destionationType,
          destination.index
        ) as ControlInterface | ActionInterface
    )

    store.dispatch(setTaskStructure(newTaskStructure))
    return
  }

  // Moved from Workspace
  // TODO Moved in the same item
  if (
    isSourceWorkspace(source) &&
    destination.droppableId === source.droppableId &&
    destination.index !== source.index
  ) {
    const id = getItemId(draggableId)
    //return
  }

  // TODO Moved in another item
  if (
    isSourceWorkspace(source) &&
    destination.droppableId !== source.droppableId
  ) {
    const id = getItemId(draggableId)
    // Insert new item in the destination item
    // Delete the old item from the source
    //return
  }

  // TODO Dropped in the Trash
  if (isDestinationTrash(destination)) {
    const newTaskStructure = deleteElement(
      taskStructure as DndItemInterface[],
      draggableId
    ) as RootDndInterface

    store.dispatch(setTaskStructure(newTaskStructure))
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
