import { TableOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const stampe: MenuItem = {
  id: 'registro',
  title: 'Registro',
  type: 'group',
  children: [
    {
      id: 'registroneutro',
      title: 'Registro Neutro',
      type: 'item',
      url: '/registroneutro',
      icon: TableOutlined,
    },
    {
      id: 'registrocompilazione',
      title: 'Compilazione registro',
      type: 'item',
      url: '/registrocompilazione',
      icon: FolderOpenOutlined,
    },
  ],
}
