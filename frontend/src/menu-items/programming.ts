import { MessageOutlined, BuildOutlined } from '@ant-design/icons'
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
      url: '/task/add?type=chat',
      icon: MessageOutlined,
    },
    {
      id: 'programminggraphical',
      title: 'Graphical interface',
      type: 'item',
      url: '/task/add?type=graphical',
      icon: BuildOutlined,
    },
  ],
}
