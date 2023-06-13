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

import { MainCard } from 'components/MainCard'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { toast } from 'react-toastify'
import { MessageText } from 'utils/messages'
import { iconMap } from 'utils/iconMap'
import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {
  defaultCurrentPage,
  defaultPageSizeSelection,
  defaultPaginationConfig,
} from 'utils/constants'
import { formatDateFrontend } from 'utils/date'
import { TaskType } from './types'

const ListTasks = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, mutate, isLoading } = useSWR<TaskType[], Error>({
    url: endpoints.home.libraries.tasks,
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/task/${id}`)
  }

  const handleEdit = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/graphic/${id}`)
  }

  const handleDelete = (id: number) => {
    fetchApi({
      url: endpoints.home.libraries.task,
      method: MethodHTTP.DELETE,
      body: {
        id,
      },
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        mutate()
        if (data?.length === 1 && tableCurrentPage > 1) {
          setTableCurrentPage(tableCurrentPage - 1)
        }
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const columns: TableColumnsType<TaskType> = [
    {
      key: 'detail',
      title: 'Detail',
      dataIndex: 'detail',
      width: 50,
      render: (_, record) => (
        <IconButton
          onClick={() => handleDetail(record.id)}
          color="primary"
          aria-label="detail"
          disabled={record.shared}
        >
          <EyeOutlined style={{ fontSize: '2em' }} />
        </IconButton>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'owner',
      title: 'Owner',
      dataIndex: 'owner',
    },
    {
      key: 'shared',
      title: 'Shared',
      dataIndex: 'shared',
      render: (shared) => {
        if (shared > 0) {
          return iconMap.successData
        }
        return iconMap.deleteCircle
      },
    },
    {
      key: 'last_modified',
      title: 'Last modified',
      dataIndex: 'last_modified',
      render: (_, record) => formatDateFrontend(record.last_modified),
    },
    {
      title: 'Operations',
      key: 'operation',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ok"
            cancelText="Cancel"
            icon={iconMap.deleteCircle}
          >
            <Button>Delete</Button>
          </Popconfirm>
          <Button onClick={() => handleEdit(record.id)}>Edit</Button>
        </Space>
      ),
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

  const handleAdd = () => {
    dispatch(activeItem(''))
    navigate('/task/add')
  }

  return (
    <MainCard title="Task list">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 2 }}
        sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          size="large"
          variant="text"
          color="primary"
          onClick={handleAdd}
          startIcon={<PlusCircleOutlined />}
        >
          Add
        </Button>
      </Stack>
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

export default ListTasks
