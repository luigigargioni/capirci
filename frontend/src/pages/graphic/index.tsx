import { CircularProgress, Typography } from '@mui/material'
import { MainCard } from 'components/MainCard'
import { TaskDetailType } from 'pages/tasks/types'
import React from 'react'
import { useParams } from 'react-router-dom'
import { endpoints } from 'services/endpoints'
import useSWR from 'swr'

const Graphic = () => {
  const { id } = useParams()

  const { data, isLoading } = useSWR<TaskDetailType, Error>({
    url: endpoints.home.libraries.task,
    body: { id },
  })

  const title = data ? `Graphic to edit the task: "${data.name}"` : ''

  return (
    <MainCard title={title}>
      {isLoading && <CircularProgress />}
      {data === null && <Typography>Task with ID {id} not found</Typography>}
      {data && <div>{data.code}</div>}
    </MainCard>
  )
}

export default Graphic
