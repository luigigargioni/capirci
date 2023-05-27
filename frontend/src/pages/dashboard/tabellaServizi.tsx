import React, { useState } from 'react'
import { TableColumnsType, TablePaginationConfig, Table } from 'antd'
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
} from 'utils/constants'
import { ServiceToDeliver } from './types'

const TabellaServizi = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading } = useSWR<ServiceToDeliver[], Error>({
    mod: endpoints.services.toDeliver.mod,
    fnz: endpoints.services.toDeliver.fnz,
  })

  const handleDetail = (reservationId: number) => {
    dispatch(activeItem(''))
    navigate(`/prenotazione/${reservationId}`)
  }

  const handleServices = (
    reservationId: number,
    petId: number,
    serviceId: number,
    isGrooming: number,
    petName: string
  ) => {
    dispatch(activeItem('servizi'))
    const petType = petName.split(' ')[0].trim()
    navigate(
      `/servizi/${reservationId}?petId=${petId}&serviceId=${serviceId}&isGrooming=${isGrooming}&petType=${petType}`
    )
  }

  const columns: TableColumnsType<ServiceToDeliver> = [
    {
      key: 'detail',
      title: 'Dettaglio',
      dataIndex: 'detail',
      width: 50,
      render: (_, record) => (
        <IconButton
          onClick={() => handleDetail(record.reservation_id)}
          color="primary"
          aria-label="detail"
        >
          <EyeOutlined style={{ fontSize: '2em' }} />
        </IconButton>
      ),
    },
    {
      key: 'services',
      title: 'Servizi',
      dataIndex: 'services',
      width: 50,
      render: (_, record) => (
        <IconButton
          onClick={() =>
            handleServices(
              record.reservation_id,
              record.pet_id,
              record.service_id,
              record.is_grooming,
              record.pet_name
            )
          }
          color="primary"
          aria-label="detail"
        >
          <ShoppingCartOutlined style={{ fontSize: '2em' }} />
        </IconButton>
      ),
    },
    {
      key: 'pet_name',
      title: 'Animale',
      dataIndex: 'pet_name',
    },
    {
      key: 'service_name',
      title: 'Servizio',
      dataIndex: 'service_name',
    },
    {
      key: 'count',
      title: 'Quantità',
      dataIndex: 'count',
    },
  ]

  const PaginationConfig: TablePaginationConfig = {
    pageSize: tablePageSize,
    current: tableCurrentPage,
    total: data?.length || 0,
    onChange: (page: number, pageSize: number) => {
      setTableCurrentPage(page)
      setTablePageSize(pageSize)
    },
    ...defaultPaginationConfig,
  }

  return (
    <MainCard title="Servizi da svolgere" sx={{ width: '100%' }}>
      <Table
        columns={columns}
        dataSource={data || []}
        pagination={PaginationConfig}
        loading={isLoading}
        rowKey="id"
        style={{ overflowX: 'auto' }}
      />
    </MainCard>
  )
}

export default TabellaServizi
