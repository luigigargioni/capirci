import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormTask } from './formTask'
import { TaskDetailType } from './types'

const DetailTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<TaskDetailType, Error>(
    !insertMode ? { url: endpoints.home.libraries.task, body: { id } } : null
  )

  const backFunction = () => {
    dispatch(activeItem('tasks'))
    navigate('/tasks')
  }

  return (
    <MainCard
      title={insertMode ? 'Add task' : 'Task detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Task with ID {id} not found</Typography>}
      {(data || insertMode) && (
        <FormTask
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailTask
