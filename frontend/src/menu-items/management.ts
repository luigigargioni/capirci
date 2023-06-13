import { RocketFilled, TeamOutlined } from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const management: MenuItem = {
  id: 'management',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: TeamOutlined,
    },
    {
      id: 'robots',
      title: 'Robots',
      type: 'item',
      url: '/robots',
      icon: RocketFilled,
    },
  ],
}
