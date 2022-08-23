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
import { SaveOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../redux'
import { CategoriesEnum } from './library'
import { useIdRef } from '../../utils/useIdRef'
import { getPageContext } from '../../utils/pageContext'
import { DndItem } from './dndArea'
import { ObjectItem } from './dndElements/objects'
import { LocationItem } from './dndElements/locations'
import { SwitcherEvents } from './dndElements/events'
import { SwitcherControls } from './dndElements/controls'
import { ActionItem } from './dndElements/actions'

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
      return <ActionItem name={p.item.name} />
    case CategoriesEnum.CONTROLS:
      return SwitcherControls(p.item.name, p.item.children)
    case CategoriesEnum.EVENTS:
      return SwitcherEvents(p.item.name)
    case CategoriesEnum.LOCATIONS:
      return <LocationItem name={p.item.name} />
    case CategoriesEnum.OBJECTS:
      return <ObjectItem name={p.item.name} />
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
            {taskStructure.length === 0 && (
              <>
                <SnippetsOutlined />
                Project area
              </>
            )}
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
