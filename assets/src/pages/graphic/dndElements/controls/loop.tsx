import { Draggable, DraggableProvided } from '@hello-pangea/dnd'
import React from 'react'
import styled from 'styled-components'
import { ActionInterface, ControlInterface } from '..'
import { CategoriesColorEnum } from '../../library'

interface ControlLoopProps {
  id: string
  name: string
  items: (ControlInterface | ActionInterface)[]
  index: number
}

export const ControlLoop = (p: ControlLoopProps) => {
  const a = 0
  return (
    <Draggable draggableId={p.id} index={p.index}>
      {(providedDraggable: DraggableProvided) => (
        <WrapperControlLoop
          color={CategoriesColorEnum.CONTROLS}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
        >
          {p.id}
        </WrapperControlLoop>
      )}
    </Draggable>
  )
}

type WrapperControlLoopProps = {
  readonly color: CategoriesColorEnum
}

const WrapperControlLoop = styled.div<WrapperControlLoopProps>`
  background-color: ${(p) => p.color};
  border-radius: 10px;
  height: 50px;
  width: 100%;
`
