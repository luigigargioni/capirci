import React from 'react'
import { DroppableWorkspaceArea, WorkspaceWrapper } from './workspace.style'
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd'
import { nanoid } from 'nanoid'
import { PlusCircleOutlined } from '@ant-design/icons'

interface WorkspaceProps {
  taskStructure: any
}

export const Workspace = (p: WorkspaceProps) => {
  const a = 0
  return (
    <Droppable droppableId={`workspace_${nanoid()}`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <WorkspaceWrapper>
          <DroppableWorkspaceArea
            ref={provided.innerRef}
            {...provided.droppableProps}
            isEmpty={p.taskStructure.length === 0}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {p.taskStructure.length === 0 && <PlusCircleOutlined />}
            {/* TASK STRUCTURE */}
            {p.taskStructure.map((task: any, index: number) => (
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
