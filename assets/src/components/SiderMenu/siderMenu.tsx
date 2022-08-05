import React from 'react'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { iconMap } from '../../utils/iconMap'
import { logout } from '../../services/authentication'
import { SiderMenuLabel, SiderMenuWrapper } from './siderMenu.style'
import { route, Item, MenuItem } from './route'
import { ItemType } from 'antd/lib/menu/hooks/useItems'

interface SiderMenuProps {
  username: string
}

export const SiderMenu = (p: SiderMenuProps) => {
  const dispatch = useDispatch()

  const openSettings = () => {
    // dispatch(openPage({ page: 'ImpostazioniUtente', name: 'Impostazioni' }))
  }

  const generateMenus = (data: (MenuItem | Item)[]): ItemType[] =>
    data.map((item: MenuItem | Item) => {
      if ('children' in item) {
        return {
          key: item.id,
          icon: iconMap[item.icon],
          label: <SiderMenuLabel>{item.name}</SiderMenuLabel>,
          children: generateMenus(item.children),
        }
      }
      return {
        key: item.id,
        /*
        onClick: () =>
          dispatch(openPage({ page: item.tabName, name: item.name })),
          */
        label: <SiderMenuLabel>{item.name}</SiderMenuLabel>,
        draggable: true,
        onDragStart: (e: DragEvent) =>
          e.dataTransfer?.setData('text/plain', item.tabName),
      }
    })

  const userMenuItems: ItemType[] = [
    {
      key: 'user',
      icon: iconMap.user,
      label: <SiderMenuLabel>{p.username}</SiderMenuLabel>,
      children: [
        {
          key: 'Impostazioni',
          onClick: openSettings,
          icon: iconMap.settings,
          label: <SiderMenuLabel>Impostazioni</SiderMenuLabel>,
        },
        {
          key: 'Esci',
          danger: true,
          onClick: () => logout(true),
          icon: iconMap.logout,
          label: <SiderMenuLabel>Esci</SiderMenuLabel>,
        },
      ],
    },
  ]

  return (
    <SiderMenuWrapper>
      <Menu
        selectedKeys={[]}
        triggerSubMenuAction="click"
        items={generateMenus(route)}
      />
      <Menu
        selectedKeys={[]}
        triggerSubMenuAction="click"
        items={userMenuItems}
      />
    </SiderMenuWrapper>
  )
}
