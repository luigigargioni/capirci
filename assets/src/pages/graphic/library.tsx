import { Tooltip } from 'antd'
import React from 'react'
import {
  CategoriesWrapper,
  ItemsWrapper,
  Category,
  LibraryItem,
  LibraryWrapper,
} from './library.style'

interface LibraryItemInterface {
  name: string
  keyword: string
}

interface LibraryCategoryInterface {
  name: string
  color: string
  info: string
  items: LibraryItemInterface[]
}

const LibraryCategories: LibraryCategoryInterface[] = [
  {
    name: 'Tasks',
    color: '#FFC107',
    info: 'These blocks represent existing tasks that you can reuse in the new program.',
    items: [
      { name: 'Tasks', keyword: 'test' },
      { name: 'Tasks1', keyword: 'test' },
      { name: 'Tasks12', keyword: 'test' },
      { name: 'Tasks13', keyword: 'test' },
      { name: 'Tasks14', keyword: 'test' },
      { name: 'Tasks15', keyword: 'test' },
    ],
  },
  {
    name: 'Controls',
    color: '#FF5722',
    info: 'Some of these blocks allow you to write tasks that perform actions repeatedly, others to perform different actions depending on the occurrence of an event. Remember, drag only other Controls or Actions into Control blocks.',
    items: [{ name: 'Controls', keyword: 'test' }],
  },
  {
    name: 'Events',
    color: '#4CAF50',
    info: 'These blocks represent the conditions that can be used to define controls. Click them to see more!',
    items: [{ name: 'Events', keyword: 'test' }],
  },
  {
    name: 'Actions',
    color: '#2196F3',
    info: 'These blocks represent the actions that the robot can execute on objects. Remember, drag only one object at a time into Actions! The robot has only one arm!',
    items: [{ name: 'Actions', keyword: 'test' }],
  },
  {
    name: 'Object',
    color: '#9C27B0',
    info: 'These blocks represent the objects that the robot can manipulate. Remember that you can drop objects only on Action and Event blocks.',
    items: [{ name: 'Object', keyword: 'test' }],
  },
  {
    name: 'Locations',
    color: '#795548',
    info: 'These blocks represent the locations where the robot can release objects. Remember that you can drop locations only on Action.',
    items: [{ name: 'Locations', keyword: 'test' }],
  },
]

export const Library = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(0)
  return (
    <LibraryWrapper>
      <CategoriesWrapper>
        {LibraryCategories.map((category, index) => (
          <Tooltip
            title={category.info}
            mouseEnterDelay={1}
            key={category.name}
            placement="right"
          >
            <Category
              key={category.name}
              color={category.color}
              selected={selectedCategory === index}
              onClick={() => setSelectedCategory(index)}
            >
              {category.name}
            </Category>
          </Tooltip>
        ))}
      </CategoriesWrapper>
      <ItemsWrapper>
        {LibraryCategories.filter(
          (_category, index) => index === selectedCategory
        ).map((category) =>
          category.items.map((item) => (
            <Tooltip
              key={item.name}
              title={item.keyword}
              placement="right"
              mouseEnterDelay={1}
            >
              <LibraryItem key={item.name} color={category.color}>
                {item.name}
              </LibraryItem>
            </Tooltip>
          ))
        )}
      </ItemsWrapper>
    </LibraryWrapper>
  )
}
