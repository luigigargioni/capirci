import {
  BugOutlined,
  ExperimentOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const avanzate: MenuItem = {
  id: 'avanzate',
  title: 'Avanzate',
  type: 'group',
  children: [
    {
      id: 'animali',
      title: 'Animali',
      type: 'item',
      url: '/animali',
      icon: BugOutlined,
    },
    {
      id: 'clienti',
      title: 'Clienti',
      type: 'item',
      url: '/clienti',
      icon: TagsOutlined,
    },
    {
      id: 'utenti',
      title: 'Utenti',
      type: 'item',
      url: '/utenti',
      icon: TeamOutlined,
    },
    {
      id: 'veterinari',
      title: 'Veterinari',
      type: 'item',
      url: '/veterinari',
      icon: ExperimentOutlined,
    },
  ],
}
