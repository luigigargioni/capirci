import { DashboardOutlined } from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const generale: MenuItem = {
  id: 'generale',
  title: 'Generale',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: DashboardOutlined,
    },
  ],
}
