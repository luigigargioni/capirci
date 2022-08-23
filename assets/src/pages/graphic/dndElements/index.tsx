import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { CategoriesColorEnum, CategoriesEnum } from '../library'

type StyledDndItemProps = {
  readonly color: CategoriesColorEnum
}

// For Objects, Locations and Events (Sensor Signal and Detect Object)
export const StyledDndItem = styled.div<StyledDndItemProps>`
  border-radius: 10px;
  background-color: ${({ color }) => color};
  color: white;
  border: 1px solid white;
  height: 20px;
`

export type RootDndInterface = (ControlInterface | ActionInterface)[]

export interface ControlInterface {
  id: string
  name: string
  category: CategoriesEnum.CONTROLS
  items: (ControlInterface | ActionInterface)[]
  event?: EventInterface
  iteration?: number
}

export interface EventInterface {
  id: string
  name: string
  category: CategoriesEnum.EVENTS
  object?: ObjectInterface
}

export interface ActionInterface {
  id: string
  name: string
  category: CategoriesEnum.ACTIONS
  object: ObjectInterface
}

export interface ObjectInterface {
  id: string
  name: string
  category: CategoriesEnum.OBJECTS
}

export interface LocationInterface {
  id: string
  name: string
  category: CategoriesEnum.LOCATIONS
}

export type DndItemInterface =
  | ControlInterface
  | EventInterface
  | ActionInterface
  | ObjectInterface
  | LocationInterface
