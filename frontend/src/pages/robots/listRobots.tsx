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
import { RobotModel, RobotType } from './types'

const ListRobots = () => {
  const [tablePageSize, setTablePageSize] = useState(defaultPageSizeSelection)
  const [tableCurrentPage, setTableCurrentPage] = useState(defaultCurrentPage)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, mutate, isLoading } = useSWR<RobotType[], Error>({
    url: endpoints.home.management.robots,
  })

  const handleDetail = (id: number) => {
    dispatch(activeItem(''))
    navigate(`/robot/${id}`)
  }

  const handleDelete = (id: number) => {
    fetchApi({
      url: endpoints.home.management.robot,
      method: MethodHTTP.DELETE,
      body: {
        id,
      },
    }).then(() => {
      toast.success(MessageText.success)
      mutate()
      if (data?.length === 1 && tableCurrentPage > 1) {
        setTableCurrentPage(tableCurrentPage - 1)
      }
    })
  }

  const columns: TableColumnsType<RobotType> = [
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
      key: 'model',
      title: 'Model',
      dataIndex: 'model',
      render: (model) => RobotModel[model],
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      key: 'port',
      title: 'Port',
      dataIndex: 'port',
    },
    {
      key: 'cameraip',
      title: 'Camera IP',
      dataIndex: 'cameraip',
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
            <Button color="error">Delete</Button>
          </Popconfirm>
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
    navigate('/robot/add')
  }

  return (
    <MainCard title="Robot list">
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

export default ListRobots
