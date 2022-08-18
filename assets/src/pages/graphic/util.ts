import { DraggableLocation } from '@hello-pangea/dnd'
import { CategoriesEnum } from './library'

export const getDraggingType = (draggableId: string) =>
  draggableId.split('_')[0] as CategoriesEnum

export const getDraggingName = (draggableId: string) =>
  draggableId.split('_')[1]

export const isSourceWorkspace = (source: DraggableLocation) =>
  source.droppableId.includes('workspace_')

export const isSourceLibrary = (source: DraggableLocation) =>
  source.droppableId.includes('library_')

export const isDestinationWorkspace = (destination: DraggableLocation) =>
  destination.droppableId.includes('workspace_')

export const isDestinationLibrary = (destination: DraggableLocation) =>
  destination.droppableId.includes('library_')
