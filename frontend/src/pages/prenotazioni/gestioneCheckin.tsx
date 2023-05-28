import React, { useState } from 'react'
import {
  Popconfirm,
  TableColumnsType,
  TablePaginationConfig,
  Space,
  Table,
} from 'antd'
import { useDispatch } from 'react-redux'
import { Button, IconButton, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { toast } from 'react-toastify'
import { DatePicker } from '@mui/x-date-pickers'
import {
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

import { MainCard } from 'components/MainCard'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { MessageText } from 'utils/messages'
import { iconMap } from 'utils/iconMap'
import { formatDateBackend, formatDateFrontend } from 'utils/date'
import { formatPetsNames, PrenotazioniListType } from 'pages/prenotazioni/types'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
} from 'utils/constants'

const GestioneCheckin = () => {

  return (
    <MainCard title="Gestione check-in">
      <div>CIAO</div>
    </MainCard>
  )
}

export default GestioneCheckin
