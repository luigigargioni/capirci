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
import { nanoid } from 'nanoid'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../redux'
import { CategoriesEnum } from './library'
import { useIdRef } from '../../utils/useIdRef'
import { getPageContext } from '../../utils/pageContext'

const alloweItems = [
  CategoriesEnum.TASKS,
  CategoriesEnum.CONTROLS,
  CategoriesEnum.ACTIONS,
]

export const Workspace = () => {
  const { taskStructure, draggingType } = useAppSelector(
    ({ graphic }) => graphic
  )
  const droppableId = useIdRef('workspace')
  const { taskName } = getPageContext()
  const isDropDisabled = !alloweItems.includes(draggingType)

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <WorkspaceWrapper>
          <TaskInfo>Taskname: {taskName}</TaskInfo>
          <DroppableWorkspaceArea
            ref={provided.innerRef}
            {...provided.droppableProps}
            isEmpty={taskStructure.length === 0}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {taskStructure.length === 0 && <PlusCircleOutlined />}
            {/* TASK STRUCTURE */}
            {taskStructure.map((task: any, index: number) => (
              <div key={nanoid()}>
                {task.type} - {task.name}
              </div>
            ))}
          </DroppableWorkspaceArea>
          {provided.placeholder}
        </WorkspaceWrapper>
      )}
    </Droppable>
  )
}
