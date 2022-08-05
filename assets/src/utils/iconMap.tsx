import React from 'react'
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ReconciliationOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  EditOutlined,
  ScheduleOutlined,
  ReadOutlined,
  SketchOutlined,
  ShopOutlined,
  TagOutlined,
  UnorderedListOutlined,
  CloseOutlined,
  CheckOutlined,
  CheckCircleTwoTone,
  EyeOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
  ExperimentOutlined,
  BellOutlined,
  CarOutlined,
} from '@ant-design/icons'
import { contextual } from '../style/colors'

const marginLeftIconMenu = '-6px'
const iconSizeMenu = '32px'
const styleMenu = { fontSize: iconSizeMenu, marginLeft: marginLeftIconMenu }

const iconSizeHeader = '24px'
const styleHeader = { fontSize: iconSizeHeader }

export const iconMap = {
  // Menu
  clienti: <TeamOutlined style={styleMenu} />,
  fornitori: <ShoppingCartOutlined style={styleMenu} />,
  ddt: <ReconciliationOutlined style={styleMenu} />,
  fatture: <FileTextOutlined style={styleMenu} />,
  ordini: <PlusCircleOutlined style={styleMenu} />,
  disegni: <EditOutlined style={styleMenu} />,
  registri: <ReadOutlined style={styleMenu} />,
  personale: <ScheduleOutlined style={styleMenu} />,
  materiali: <SketchOutlined style={styleMenu} />,
  magazzino: <ShopOutlined style={styleMenu} />,
  tipi: <TagOutlined style={styleMenu} />,
  listini: <UnorderedListOutlined style={styleMenu} />,
  user: <UserOutlined style={styleMenu} />,
  test: <ExperimentOutlined style={styleMenu} />,

  //Header
  notifiche: <BellOutlined style={styleHeader} />,
  veicoli: <CarOutlined style={styleHeader} />,

  logout: <LogoutOutlined style={{ fontSize: iconSizeMenu }} />,
  settings: <SettingOutlined style={{ fontSize: iconSizeMenu }} />,

  // CRUD Functionbar
  view: <EyeOutlined />,
  edit: <EditOutlined />,
  insert: <PlusCircleOutlined />,
  delete: <DeleteOutlined />,

  check: <CheckOutlined />,
  close: <CloseOutlined />,
  checkColor: <CheckCircleTwoTone twoToneColor={contextual.success.main} />,
  deleteData: <CloseCircleOutlined style={{ color: contextual.error.main }} />,
  warning: (
    <ExclamationCircleOutlined
      key="ExclamationCircleOutlined"
      style={{
        color: contextual.warning.main,
        marginRight: '10px',
        fontSize: 'large',
      }}
    />
  ),
  refresh: <ReloadOutlined />,
}
