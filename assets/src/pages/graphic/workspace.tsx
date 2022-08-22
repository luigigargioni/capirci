import React from 'react'
import {
  DroppableWorkspaceArea,
  TaskInfo,
  WorkspaceWrapper,
} from './workspace.style'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'
import { PlusCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../redux'
import { CategoriesEnum } from './library'
import { useIdRef } from '../../utils/useIdRef'
import { getPageContext } from '../../utils/pageContext'
import { DndItem } from './dndArea'

const alloweItems = [
  CategoriesEnum.TASKS,
  CategoriesEnum.CONTROLS,
  CategoriesEnum.ACTIONS,
]

interface SwitcherStructureProps {
  item: DndItem
}

const SwitcherStructure = (p: SwitcherStructureProps) => {
  switch (p.item.type) {
    case CategoriesEnum.ACTIONS:
      return <></>
    case CategoriesEnum.CONTROLS:
      return <></>
    case CategoriesEnum.EVENTS:
      return <></>
    case CategoriesEnum.LOCATIONS:
      return <></>
    case CategoriesEnum.OBJECTS:
      return <></>
    //case CategoriesEnum.TASKS:
    default:
      return <></>
  }
}

export const Workspace = () => {
  const { taskStructure, draggingType } = useAppSelector(
    ({ graphic }) => graphic
  )
  const droppableId = useIdRef('workspace')
  const { taskName } = getPageContext()
  const isDropDisabled = !alloweItems.includes(draggingType)

  const saveTask = () => {}

  return (
    <WorkspaceWrapper>
      <TaskInfo>
        Task name: {taskName}
        <SaveOutlined onClick={saveTask} title="Save" />
      </TaskInfo>
      <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <DroppableWorkspaceArea
            ref={provided.innerRef}
            {...provided.droppableProps}
            isEmpty={taskStructure.length === 0}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {taskStructure.length === 0 && <PlusCircleOutlined />}
            {taskStructure.map((item: DndItem) => (
              <SwitcherStructure item={item} />
            ))}
            <span style={{ display: 'none' }}>{provided.placeholder}</span>
          </DroppableWorkspaceArea>
        )}
      </Droppable>
    </WorkspaceWrapper>
  )
}
