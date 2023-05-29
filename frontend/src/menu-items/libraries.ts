import {
  HistoryOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
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
      icon: ArrowRightOutlined,
    },
    {
      id: 'objects',
      title: 'Objects',
      type: 'item',
      url: '/objects',
      icon: ArrowLeftOutlined,
    },
    {
      id: 'actions',
      title: 'Actions',
      type: 'item',
      url: '/actions',
      icon: HistoryOutlined,
    },
    {
      id: 'locations',
      title: 'Locations',
      type: 'item',
      url: '/locations',
      icon: CalendarOutlined,
    },
  ],
}
