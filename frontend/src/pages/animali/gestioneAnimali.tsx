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
import {
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
} from 'utils/constants'
import { AnimaleType, AnimaleTypeArray } from './types'

const GestioneAnimali = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [textFilter, setTextFilter] = useState<string>('')
  const [appliedTextFilter, setAppliedTextFilter] = useState<string>('')
  const { data, mutate, isLoading } = useSWR<
    { records: AnimaleType[]; total: number },
    Error
  >({
    mod: endpoints.pet.list.mod,
    fnz: endpoints.pet.list.fnz,
    body: {
      limit: tablePageSize,
      page: tableCurrentPage,
      search: appliedTextFilter,
    },
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/animale/${id}`)
  }
  const handleDelete = (id: number) => {
    fetchApi({
      mod: endpoints.pet.delete.mod,
      fnz: endpoints.pet.delete.fnz,
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

  const columns: TableColumnsType<AnimaleType> = [
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
      key: 'name',
      title: 'Nome',
      dataIndex: 'name',
    },
    {
      key: 'type',
      title: 'Tipo',
      dataIndex: 'type',
      render: (type) =>
        AnimaleTypeArray.find((item) => item.value === type)?.label,
    },
    {
      key: 'breed',
      title: 'Razza',
      dataIndex: 'breed',
    },
    {
      key: 'size',
      title: 'Dimensione',
      dataIndex: 'size',
    },
    {
      key: 'microchip',
      title: 'Microchip',
      dataIndex: 'microchip',
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
            <Button>Elimina</Button>
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

  const handleAddPet = () => {
    dispatch(activeItem(''))
    navigate('/animale/add')
  }

  return (
    <MainCard title="Gestione animali">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 2 }}
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          size="large"
          variant="text"
          color="primary"
          onClick={handleAddPet}
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

export default GestioneAnimali
