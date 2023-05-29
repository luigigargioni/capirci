import { TableOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const programming: MenuItem = {
  id: 'programming',
  title: 'Programming',
  type: 'group',
  children: [
    {
      id: 'programmingchat',
      title: 'Chat',
      type: 'item',
      url: '/programmingchat',
      icon: TableOutlined,
    },
    {
      id: 'programminggraphical',
      title: 'Graphical interface',
      type: 'item',
      url: '/programminggraphical',
      icon: FolderOpenOutlined,
    },
    {
      id: 'myrobots',
      title: 'My robots',
      type: 'item',
      url: '/myrobots',
      icon: FolderOpenOutlined,
    },
  ],
}
