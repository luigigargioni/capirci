import { DraggableLocation } from '@hello-pangea/dnd'
import { CategoriesEnum } from './library'

export const LIBRARY_ID = 'library'
export const WORKSPACE_ID = 'workspace'
export const TRASH_ID = 'trash'

export const getItemCategory = (itemId: string): CategoriesEnum =>
  itemId.split('_')[0] as CategoriesEnum

export const getItemName = (itemId: string): string => itemId.split('_')[1]

export const getItemId = (itemId: string): string => itemId.split('_')[2]

export const getItemType = (itemId: string): string => itemId.split('_')[3]

export const isSourceWorkspace = (source: DraggableLocation): boolean =>
  source.droppableId.includes(`${WORKSPACE_ID}_`)

export const isSourceLibrary = (source: DraggableLocation): boolean =>
  source.droppableId.includes(`${LIBRARY_ID}_`)

export const isDestinationWorkspace = (
  destination: DraggableLocation
): boolean => destination.droppableId.includes(`${WORKSPACE_ID}_`)

export const isDestinationLibrary = (destination: DraggableLocation): boolean =>
  destination.droppableId.includes(`${LIBRARY_ID}_`)

export const isDestinationTrash = (destination: DraggableLocation): boolean =>
  destination.droppableId.includes(`${TRASH_ID}_`)
