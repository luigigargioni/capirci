import React from 'react'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd'
import { Tooltip } from 'antd'
import {
  CategoriesWrapper,
  ItemsWrapper,
  CategoryItem,
  LibraryItem,
  LibraryWrapper,
  CloneLibraryItem,
  ScrollableWrapper,
} from './library.style'
import { useIdRef } from '../../utils/useIdRef'
import useSWR from 'swr'
import { endpoints } from '../../services/api'
import { GlobalOutlined } from '@ant-design/icons'

interface LibraryItemInterface {
  id: number
  name: string
  info?: string
  shared?: boolean
  keywords?: string[]
}

interface LibraryCategoryInterface {
  name: string
  color: string
  info: string
  items?: LibraryItemInterface[]
}

export enum CategoriesEnum {
  TASKS = 'Tasks',
  CONTROLS = 'Controls',
  EVENTS = 'Events',
  ACTIONS = 'Actions',
  OBJECTS = 'Objects',
  LOCATIONS = 'Locations',
}

const LibraryCategories: LibraryCategoryInterface[] = [
  {
    name: CategoriesEnum.CONTROLS,
    color: '#FF5722',
    info: 'Some of these blocks allow you to write tasks that perform actions repeatedly, others to perform different actions depending on the occurrence of an event. Remember, drag only other Controls or Actions into Control blocks.',
    items: [
      {
        id: 0,
        name: 'Repeat for # times',
        info: 'This instruction performs an actions sequence exactly the specified number of times',
      },
      {
        id: 1,
        name: 'Loop',
        info: 'This instruction performs an actions sequence exactly the specified number of times',
      },
      {
        id: 2,
        name: 'When',
        info: 'This instruction performs an action sequence if a certain event occurs',
      },
      {
        id: 3,
        name: 'Stop when',
        info: 'This instruction stops the actions sequence when a specific event occurs',
      },
      {
        id: 4,
        name: 'Do when',
        info: 'This instruction repeatedly performs an action sequence until a certain event occurs',
      },
    ],
  },
  {
    name: CategoriesEnum.EVENTS,
    color: '#4CAF50',
    info: 'These blocks represent the conditions that can be used to define controls',
    items: [
      {
        id: 0,
        name: 'Find',
        info: 'This event represents the recognition of a specific object',
      },
      {
        id: 1,
        name: 'Sensor signal',
        info: 'This event represents the detection of a signal coming from a generic sensor',
      },
      {
        id: 2,
        name: 'Detect an object',
        info: 'This event represents the detection of the presence of a generic object',
      },
    ],
  },
  {
    name: CategoriesEnum.ACTIONS,
    color: '#2196F3',
    info: 'These blocks represent the actions that the robot can execute on objects. Remember, drag only one object at a time into Actions! The robot has only one arm!',
  },
  {
    name: CategoriesEnum.OBJECTS,
    color: '#9C27B0',
    info: 'These blocks represent the objects that the robot can manipulate. Remember that you can drop objects only on Action and Event blocks.',
  },
  {
    name: CategoriesEnum.LOCATIONS,
    color: '#795548',
    info: 'These blocks represent the locations where the robot can release objects. Remember that you can drop locations only on Action.',
  },
  {
    name: CategoriesEnum.TASKS,
    color: '#FFC107',
    info: 'These blocks represent existing tasks that you can reuse in the new program.',
  },
]

export const Library = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(0)
  const droppableId = useIdRef('library')

  const { data: actions } = useSWR(endpoints.graphic.actions)
  const { data: objects } = useSWR(endpoints.graphic.objects)
  const { data: locations } = useSWR(endpoints.graphic.locations)
  const { data: tasks } = useSWR(endpoints.graphic.tasks)

  return (
    <LibraryWrapper>
      <CategoriesWrapper>
        <ScrollableWrapper>
          {LibraryCategories.map((category, index) => (
            <Tooltip
              title={category.info}
              mouseEnterDelay={1}
              key={category.name}
              placement="right"
            >
              <CategoryItem
                key={category.name}
                color={category.color}
                selected={selectedCategory === index}
                onClick={() => setSelectedCategory(index)}
              >
                {category.name}
              </CategoryItem>
            </Tooltip>
          ))}
        </ScrollableWrapper>
      </CategoriesWrapper>
      <Droppable droppableId={droppableId} isDropDisabled>
        {(providedDroppable: DroppableProvided) => (
          <ItemsWrapper
            ref={providedDroppable.innerRef}
            {...providedDroppable.droppableProps}
          >
            <ScrollableWrapper>
              {LibraryCategories.filter(
                (_category, index) => index === selectedCategory
              ).map((category) => {
                const items =
                  category.name === CategoriesEnum.ACTIONS
                    ? actions
                    : category.name === CategoriesEnum.OBJECTS
                    ? objects
                    : category.name === CategoriesEnum.LOCATIONS
                    ? locations
                    : category.name === CategoriesEnum.TASKS
                    ? tasks
                    : category.items
                return items.map(
                  (item: LibraryItemInterface, index: number) => (
                    <Draggable
                      key={item.name}
                      index={index}
                      draggableId={`${category.name}_${item.name}`}
                    >
                      {(
                        providedDraggable: DraggableProvided,
                        snapshotDraggable: DraggableStateSnapshot
                      ) => {
                        const objectKeywords =
                          category.name === CategoriesEnum.OBJECTS
                            ? item.keywords.reduce(
                                (acc, str) =>
                                  acc !== '' ? `${acc}, ${str}` : str,
                                ''
                              )
                            : null
                        return (
                          <>
                            <Tooltip
                              title={
                                category.name === CategoriesEnum.OBJECTS
                                  ? objectKeywords
                                  : item.info
                              }
                              mouseEnterDelay={1}
                              key={category.name}
                              placement="right"
                            >
                              <LibraryItem
                                key={item.id}
                                color={category.color}
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                isDragging={snapshotDraggable.isDragging}
                                style={{
                                  ...providedDraggable.draggableProps.style,
                                  transform: snapshotDraggable.isDragging
                                    ? providedDraggable.draggableProps.style
                                        ?.transform
                                    : 'translate(0px, 0px)',
                                }}
                              >
                                {item.name}
                                {item.shared && <GlobalOutlined />}
                              </LibraryItem>
                            </Tooltip>
                            {snapshotDraggable.isDragging && (
                              <CloneLibraryItem
                                color={category.color}
                                isDragging={false}
                              >
                                {item.name}
                              </CloneLibraryItem>
                            )}
                          </>
                        )
                      }}
                    </Draggable>
                  )
                )
              })}
              {providedDroppable.placeholder}
            </ScrollableWrapper>
          </ItemsWrapper>
        )}
      </Droppable>
    </LibraryWrapper>
  )
}
