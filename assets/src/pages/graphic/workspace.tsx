import React from 'react'
import { DroppableWorkspaceArea, WorkspaceWrapper } from './workspace.style'
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

export const Workspace = () => {
  const { taskStructure, draggingType } = useAppSelector(
    ({ graphic }) => graphic
  )
  const droppableId = useIdRef('workspace')

  const isDropDisabled = ![
    CategoriesEnum.TASKS,
    CategoriesEnum.EVENTS,
    CategoriesEnum.ACTIONS,
  ].includes(draggingType)

  return (
    <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <WorkspaceWrapper>
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
