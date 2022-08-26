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
import { ObjectItem } from './dndElements/objects'
import { LocationItem } from './dndElements/locations'
import { SwitcherEvents } from './dndElements/events'
import { SwitcherControls } from './dndElements/controls'
import { ActionItem } from './dndElements/actions'
import { notificationSuccess } from '../../components/Notification'
import { WORKSPACE_ID } from './util'
import {
  ActionInterface,
  ControlInterface,
  EventInterface,
  LocationInterface,
  ObjectInterface,
} from './dndElements'
import { Button, Tooltip } from 'antd'

const alloweItems = [
  CategoriesEnum.TASKS,
  CategoriesEnum.CONTROLS,
  CategoriesEnum.ACTIONS,
]

interface SwitcherStructureProps {
  item:
    | ControlInterface
    | EventInterface
    | ActionInterface
    | ObjectInterface
    | LocationInterface
  index: number
}

export const SwitcherStructure = (p: SwitcherStructureProps) => {
  switch (p.item.category) {
    case CategoriesEnum.ACTIONS:
      return (
        <ActionItem id={p.item.id} name={p.item.name} object={p.item.object} />
      )
    case CategoriesEnum.CONTROLS:
      return SwitcherControls(p.item, p.index)
    case CategoriesEnum.EVENTS:
      return SwitcherEvents(p.item)
    case CategoriesEnum.OBJECTS:
      return <ObjectItem id={p.item.id} name={p.item.name} />
    case CategoriesEnum.LOCATIONS:
      return <LocationItem id={p.item.id} name={p.item.name} />
    //case CategoriesEnum.TASKS:
    default:
      return <></>
  }
}

export const Workspace = () => {
  const { taskStructure, draggingType } = useAppSelector(
    ({ graphic }) => graphic
  )
  const droppableId = useIdRef(WORKSPACE_ID)
  const { taskName } = getPageContext()
  const isDropDisabled = !alloweItems.includes(draggingType)

  const saveTask = () => {
    notificationSuccess('Task saved')
  }

  return (
    <WorkspaceWrapper>
      <TaskInfo>
        Task name: {taskName}
        <Tooltip title="Save task">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<SaveOutlined onClick={saveTask} />}
          />
        </Tooltip>
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
            {taskStructure.map(
              (item: ControlInterface | ActionInterface, index: number) => (
                <SwitcherStructure key={item.id} item={item} index={index} />
              )
            )}
            {taskStructure.length === 0 ? (
              <span style={{ display: 'none' }}>{provided.placeholder}</span>
            ) : (
              provided.placeholder
            )}
          </DroppableWorkspaceArea>
        )}
      </Droppable>
    </WorkspaceWrapper>
  )
}
