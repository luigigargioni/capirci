import {
  AimOutlined,
  ApartmentOutlined,
  TagOutlined,
  SubnodeOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const libraries: MenuItem = {
  id: 'libraries',
  title: 'Libraries',
  type: 'group',
  children: [
    {
      id: 'tasks',
      title: 'Tasks',
      type: 'item',
      url: '/tasks',
      icon: ApartmentOutlined,
    },
    {
      id: 'objects',
      title: 'Objects',
      type: 'item',
      url: '/objects',
      icon: TagOutlined,
    },
    {
      id: 'actions',
      title: 'Actions',
      type: 'item',
      url: '/actions',
      icon: SubnodeOutlined,
    },
    {
      id: 'locations',
      title: 'Locations',
      type: 'item',
      url: '/locations',
      icon: AimOutlined,
    },
    {
      id: 'myrobots',
      title: 'My robots',
      type: 'item',
      url: '/myrobots',
      icon: ToolOutlined,
    },
  ],
}
