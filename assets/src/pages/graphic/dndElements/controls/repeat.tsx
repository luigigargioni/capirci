import { SnippetsOutlined } from '@ant-design/icons'
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'
import { InputNumber } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ActionInterface, ControlInterface } from '..'
import { useAppSelector } from '../../../../redux'
import { setTaskStructure } from '../../../../redux/graphic'
import { store } from '../../../../store'
import {
  CategoriesColorEnum,
  CategoriesEnum,
  ControlsValuesEnum,
} from '../../library'
import { SwitcherStructure } from '../../workspace'

interface ControlRepeatProps {
  id: string
  name: string
  items: (ControlInterface | ActionInterface)[]
  iteration: number
  index: number
}

const alloweItems = [CategoriesEnum.CONTROLS, CategoriesEnum.ACTIONS]

const setIterationTaskStructure = (
  id: string,
  currentNode: ControlInterface | ActionInterface,
  value: number
): ControlInterface | ActionInterface => {
  if (
    currentNode.category === CategoriesEnum.CONTROLS &&
    currentNode.name === ControlsValuesEnum.REPEAT &&
    id === currentNode.id
  ) {
    const newNode: ControlInterface = { ...currentNode, iteration: value }
    return newNode
  }

  if ('items' in currentNode && currentNode.items.length > 0) {
    const newItems = currentNode.items.map(
      (item: ControlInterface | ActionInterface) =>
        setIterationTaskStructure(id, item, value)
    )
    return { ...currentNode, items: newItems }
  }

  return currentNode
}

export const ControlRepeat = (p: ControlRepeatProps) => {
  const [iteration, setIteration] = useState(p.iteration)
  const { draggingType, taskStructure } = useAppSelector(
    ({ graphic }) => graphic
  )
  const isDropDisabled = !alloweItems.includes(draggingType)

  const onChangeIteration = (value: number) => {
    const newTaskStructure = taskStructure.map((taskStructureItem) =>
      setIterationTaskStructure(p.id, taskStructureItem, value)
    )
    store.dispatch(setTaskStructure(newTaskStructure))
    setIteration(value)
  }

  return (
    <Draggable draggableId={p.id} index={p.index}>
      {(providedDraggable: DraggableProvided) => (
        <WrapperControlRepeat
          color={CategoriesColorEnum.CONTROLS}
          ref={providedDraggable.innerRef}
          {...providedDraggable.draggableProps}
          {...providedDraggable.dragHandleProps}
        >
          <WrapperIteration>
            {p.name}
            <InputNumber
              value={iteration}
              onChange={onChangeIteration}
              min={1}
              size="small"
            />
          </WrapperIteration>
          <Droppable droppableId={`${p.id}_items`}>
            {(
              providedDroppable: DroppableProvided,
              snapshotDroppable: DroppableStateSnapshot
            ) => (
              <ItemsControlRepeat
                ref={providedDroppable.innerRef}
                {...providedDroppable.droppableProps}
                isEmpty={p.items.length === 0}
                isDraggingOver={false}
              >
                {p.items.length === 0 && (
                  <>
                    <SnippetsOutlined />
                    Drop here Controls or Actions
                  </>
                )}
                {p.items.map(
                  (item: ControlInterface | ActionInterface, index: number) => (
                    <SwitcherStructure
                      key={item.id}
                      item={item}
                      index={index}
                    />
                  )
                )}
                {providedDroppable.placeholder}
              </ItemsControlRepeat>
            )}
          </Droppable>
        </WrapperControlRepeat>
      )}
    </Draggable>
  )
}

type WrapperControlRepeatProps = {
  readonly color: CategoriesColorEnum
}

const WrapperControlRepeat = styled.div<WrapperControlRepeatProps>`
  background-color: ${(p) => p.color};
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: 1px solid white;
  border-radius: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`

const WrapperIteration = styled.div`
  display: flex;
  & > .ant-input-number {
    margin-left: 10px;
  }
`

type ItemsControlRepeatProps = {
  readonly isEmpty: boolean
  readonly isDraggingOver: boolean
}

const ItemsControlRepeat = styled.div<ItemsControlRepeatProps>`
  border: ${({ isDraggingOver }) => (isDraggingOver ? '4px' : '2px')} dashed
    ${({ theme }) => theme.colors.neutral.gray7};
  color: ${({ isEmpty, isDraggingOver, theme }) =>
    isEmpty
      ? isDraggingOver
        ? theme.colors.neutral.gray6
        : theme.colors.neutral.gray7
      : 'inherit'};
  background-color: white;
  background-color: ${({ isDraggingOver, theme }) =>
    isDraggingOver && theme.colors.primary.light4};
  transition: background-color 0.2s linear;
  border-radius: 10px;
  margin-top: 1rem;
  max-height: 95%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
