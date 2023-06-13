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
import {
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
  RedoOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { toast } from 'react-toastify'

import { MainCard } from 'components/MainCard'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { MessageText } from 'utils/messages'
import { iconMap } from 'utils/iconMap'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
  USER_GROUP,
} from 'utils/constants'
import { UserType } from 'pages/utenti/types'

const GestioneUtenti = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [textFilter, setTextFilter] = useState<string>('')
  const [appliedTextFilter, setAppliedTextFilter] = useState<string>('')
  const { data, mutate, isLoading } = useSWR<
    { records: UserType[]; total: number },
    Error
  >({
    mod: endpoints.user.list.mod,
    fnz: endpoints.user.list.fnz,
    body: {
      limit: tablePageSize,
      page: tableCurrentPage,
      search: appliedTextFilter,
    },
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/utente/${id}`)
  }
  const handleActivate = (id: number, active: number) => {
    const activeParam = active === 1
    fetchApi({
      mod: endpoints.user.activate.mod,
      fnz: endpoints.user.activate.fnz,
      body: { id, active: !activeParam },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        mutate()
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const handleResetPassword = (id: number) => {
    fetchApi({
      mod: endpoints.user.resetPwd.mod,
      fnz: endpoints.user.resetPwd.fnz,
      body: { id },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const columns: TableColumnsType<UserType> = [
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
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: 'Ruolo',
      dataIndex: 'role',
      render: (_, record) => (
        <span>
          {record.role === USER_GROUP.ADMIN ? 'Amministratore' : 'Operatore'}
        </span>
      ),
    },
    {
      key: 'active',
      title: 'Attivo',
      dataIndex: 'active',
      width: 50,
      render: (_, record) => {
        if (record.active === 1) return iconMap.successData
        if (record.active === 0) return iconMap.deleteCircle
        return ''
      },
    },
    {
      title: 'Opzioni',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Confermare?"
            onConfirm={() => handleActivate(record.id, record.active)}
            okText="Ok"
            cancelText="Annulla"
            icon={
              record.active === 1 ? iconMap.deleteCircle : iconMap.successData
            }
          >
            <Button>{record.active === 1 ? 'Disabilita' : 'Abilita'}</Button>
          </Popconfirm>
          <Popconfirm
            title="Confermare?"
            onConfirm={() => handleResetPassword(record.id)}
            okText="Ok"
            cancelText="Annulla"
            icon={<RedoOutlined />}
          >
            <Button>Reset password</Button>
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

  const handleAddUser = () => {
    dispatch(activeItem(''))
    navigate('/utente/add')
  }

  return (
    <MainCard title="Gestione utenti">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 2 }}
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          size="large"
          variant="text"
          color="primary"
          onClick={handleAddUser}
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

export default GestioneUtenti
