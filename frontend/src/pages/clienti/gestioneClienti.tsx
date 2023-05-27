import React, { useState } from 'react'
import {
  Popconfirm,
  TableColumnsType,
  TablePaginationConfig,
  Space,
  Table,
} from 'antd'
import { useDispatch } from 'react-redux'
import { Button, IconButton, Stack, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { MainCard } from 'components/MainCard'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { toast } from 'react-toastify'
import { MessageText } from 'utils/messages'
import { iconMap } from 'utils/iconMap'
import { formatDateFrontend } from 'utils/date'
import {
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { ClienteType } from 'pages/clienti/types'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
} from 'utils/constants'

const GestioneClienti = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [textFilter, setTextFilter] = useState<string>('')
  const [appliedTextFilter, setAppliedTextFilter] = useState<string>('')
  const { data, mutate, isLoading } = useSWR<
    { records: ClienteType[]; total: number },
    Error
  >({
    mod: endpoints.customer.list.mod,
    fnz: endpoints.customer.list.fnz,
    body: {
      limit: tablePageSize,
      page: tableCurrentPage,
      search: appliedTextFilter,
    },
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/cliente/${id}`)
  }
  const handleDelete = (id: number) => {
    fetchApi({
      mod: endpoints.customer.delete.mod,
      fnz: endpoints.customer.delete.fnz,
      body: { id },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        mutate()
        if (data?.records.length === 1 && tableCurrentPage > 1) {
          setTableCurrentPage(tableCurrentPage - 1)
        }
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const columns: TableColumnsType<ClienteType> = [
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
      key: 'first_name',
      title: 'Nome',
      dataIndex: 'first_name',
    },
    {
      key: 'last_name',
      title: 'Cognome',
      dataIndex: 'last_name',
    },
    {
      key: 'fiscal_code',
      title: 'Codice fiscale',
      dataIndex: 'fiscal_code',
    },
    {
      key: 'city',
      title: 'Città',
      dataIndex: 'city',
    },
    {
      key: 'birth_date',
      title: 'Data di nascita',
      dataIndex: 'birth_date',
      render: (_, record) => formatDateFrontend(record.birth_date),
    },
    {
      key: 'phone',
      title: 'Telefono',
      dataIndex: 'phone',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Opzioni',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Eliminare?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ok"
            cancelText="Annulla"
            icon={iconMap.deleteCircle}
          >
            <Button disabled>Disabilita</Button>
          </Popconfirm>
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
    setTableCurrentPage(defaultCurrentPage)
    setAppliedTextFilter(textFilter)
  }

  const handleResetFilter = () => {
    setTableCurrentPage(defaultCurrentPage)
    setTextFilter('')
    setAppliedTextFilter('')
  }

  const handleAddCustomer = () => {
    dispatch(activeItem(''))
    navigate('/cliente/add')
  }

  return (
    <MainCard title="Gestione clienti">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 2 }}
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          size="large"
          variant="text"
          color="primary"
          onClick={handleAddCustomer}
          startIcon={<PlusCircleOutlined />}
        >
          Aggiungi
        </Button>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 2, md: 4 }}
          sx={{ mb: 2 }}
        >
          <TextField
            label="Cerca"
            id="textFilter"
            name="textFilter"
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilter()
              }
            }}
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

export default GestioneClienti
