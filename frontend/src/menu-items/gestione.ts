import {
  HistoryOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { MenuItem } from 'menu-items/types'

export const gestione: MenuItem = {
  id: 'gestione',
  title: 'Gestione',
  type: 'group',
  children: [
    {
      id: 'checkin',
      title: 'Check-in',
      type: 'item',
      url: '/checkin',
      icon: ArrowRightOutlined,
    },
    {
      id: 'checkout',
      title: 'Check-out',
      type: 'item',
      url: '/checkout',
      icon: ArrowLeftOutlined,
    },
    {
      id: 'storico',
      title: 'Storico',
      type: 'item',
      url: '/storico',
      icon: HistoryOutlined,
    },
    {
      id: 'presenze',
      title: 'Presenze',
      type: 'item',
      url: '/presenze',
      icon: CalendarOutlined,
    },
    {
      id: 'servizi',
      title: 'Servizi',
      type: 'item',
      url: '/servizi',
      icon: ShoppingCartOutlined,
    },
  ],
}
