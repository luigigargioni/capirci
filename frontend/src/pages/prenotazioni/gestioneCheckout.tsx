import React, { useState } from 'react'
import { TableColumnsType, TablePaginationConfig, Space, Table } from 'antd'
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
  ShoppingCartOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

import { MainCard } from 'components/MainCard'
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

const GestioneCheckout = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const [dateFromFilter, setDateFromFilter] = useState<string | null>(null)
  const [dateToFilter, setDateToFilter] = useState<string | null>(null)
  const [appliedDateFromFilter, setAppliedDateFromFilter] = useState<
    string | null
  >(null)
  const [appliedDateToFilter, setAppliedDateToFilter] = useState<string | null>(
    null
  )
  const [errorFilter, setErrorFilter] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading } = useSWR<
    { records: PrenotazioniListType[]; total: number },
    Error
  >({
    mod: endpoints.reservation.list.mod,
    fnz: endpoints.reservation.list.fnz,
    body: {
      limit: tablePageSize,
      page: tableCurrentPage,
      date_from: formatDateBackend(appliedDateFromFilter),
      date_to: formatDateBackend(appliedDateToFilter),
      to_checkin: 0,
      to_checkout: 1,
      history: 0,
    },
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/prenotazione/${id}?type=detailCheckout`)
  }

  const handleCheckOut = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/prenotazione/${id}?type=checkout`)
  }

  const handleServices = (id: number) => {
    dispatch(activeItem('servizi'))
    navigate(`/servizi/${id}`)
  }

  const columns: TableColumnsType<PrenotazioniListType> = [
    {
      key: 'detail',
      title: 'Dettaglio',
      dataIndex: 'detail',
      width: 50,
      render: (_, record) => (
        <IconButton
          onClick={() => handleDetail(record.id)}
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
          onClick={() => handleServices(record.id)}
          color="primary"
          aria-label="detail"
        >
          <ShoppingCartOutlined style={{ fontSize: '2em' }} />
        </IconButton>
      ),
    },
    {
      key: 'date_to',
      title: 'Data a',
      dataIndex: 'date_to',
      width: 100,
      render: (_, record) => formatDateFrontend(record.date_to),
    },
    {
      key: 'date_from',
      title: 'Data da',
      dataIndex: 'date_from',
      width: 100,
      render: (_, record) => formatDateFrontend(record.date_from),
    },
    {
      key: 'customer_name',
      title: 'Cliente',
      dataIndex: 'customer_name',
      width: 200,
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      key: 'pets_names',
      title: 'Animali',
      dataIndex: 'pets_names',
      width: 600,
      render: (_, record) => formatPetsNames(record.pets_names),
    },
    {
      key: 'webcam',
      title: 'Webcam',
      dataIndex: 'webcam',
      width: 50,
      render: (webcam) => {
        if (webcam > 0) {
          return iconMap.webcamOn
        }
        return iconMap.webcamOff
      },
    },
    {
      key: 'bath',
      title: 'Bagno',
      dataIndex: 'bath',
      width: 50,
      render: (bath) => {
        if (bath > 0) {
          return iconMap.bathOn
        }
        return iconMap.bathOff
      },
    },
    {
      key: 'paid',
      title: 'Pagata',
      dataIndex: 'paid',
      width: 50,
      render: (_, record) => {
        if (record.payment_amount > 0) return iconMap.successData
        if (
          (record.payment_amount === 0 || record.payment_amount === null) &&
          record.advance_payment_amount > 0
        )
          return iconMap.partialData
        if (
          (record.payment_amount === 0 || record.payment_amount === null) &&
          (record.advance_payment_amount === 0 ||
            record.advance_payment_amount === null)
        )
          return iconMap.deleteCircle
        return ''
      },
    },
    {
      title: 'Opzioni',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleCheckOut(record.id)}>Check out</Button>
        </Space>
      ),
    },
  ]

  const PaginationConfig: TablePaginationConfig = {
    pageSize: tablePageSize,
    current: tableCurrentPage,
    total: data?.total,
    onChange: (page: number, pageSize: number) => {
      setTableCurrentPage(page)
      setTablePageSize(pageSize)
    },
    ...defaultPaginationConfig,
  }

  const handleFilter = () => {
    if (dayjs(dateFromFilter).diff(dayjs(dateToFilter)) > 0) {
      toast.error(MessageText.invalidDate)
      setErrorFilter(true)
      return
    }
    setTableCurrentPage(defaultCurrentPage)
    setAppliedDateFromFilter(dateFromFilter)
    setAppliedDateToFilter(dateToFilter)
  }

  const handleResetFilter = () => {
    setDateFromFilter(null)
    setDateToFilter(null)
    setTableCurrentPage(defaultCurrentPage)
    setAppliedDateFromFilter(null)
    setAppliedDateToFilter(null)
  }

  const handleAddReservation = () => {
    dispatch(activeItem(''))
    navigate('/prenotazione/add?type=detailCheckout')
  }

  return (
    <MainCard title="Gestione check-out">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 2 }}
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          size="large"
          variant="text"
          color="primary"
          onClick={handleAddReservation}
          startIcon={<PlusCircleOutlined />}
        >
          Aggiungi prenotazione
        </Button>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2, md: 4 }}
          sx={{ mb: 2 }}
        >
          <DatePicker
            label="Data da"
            value={dateFromFilter}
            onChange={(newValue) => {
              setDateFromFilter(newValue)
              setErrorFilter(false)
            }}
            slotProps={{ textField: { error: errorFilter } }}
          />
          <DatePicker
            label="Data a"
            value={dateToFilter}
            onChange={(newValue) => {
              setDateToFilter(newValue)
              setErrorFilter(false)
            }}
            slotProps={{ textField: { error: errorFilter } }}
          />
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleFilter}
            startIcon={<FilterOutlined />}
          >
            Filtra
          </Button>
          <Button
            size="large"
            variant="outlined"
            color="primary"
            onClick={handleResetFilter}
            startIcon={<ReloadOutlined />}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
      <Table
        columns={columns}
        dataSource={data?.records || []}
        pagination={PaginationConfig}
        loading={isLoading}
        rowKey="id"
        style={{ overflowX: 'auto' }}
      />
    </MainCard>
  )
}

export default GestioneCheckout
