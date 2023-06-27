import { CircularProgress, Typography } from '@mui/material'
import { MainCard } from 'components/MainCard'
import { TaskDetailType } from 'pages/tasks/types'
import React from 'react'
import { useParams } from 'react-router-dom'
import { endpoints } from 'services/endpoints'
import useSWR from 'swr'
import { ChatWrapper } from './chatWrapper'

const Chat = () => {
  const { id } = useParams()

  const { data, isLoading } = useSWR<TaskDetailType, Error>({
    url: endpoints.home.libraries.task,
    body: { id },
  })

  const title = data ? `Chat to create the task: "${data.name}"` : ''

  return (
    <MainCard title={title}>
      {isLoading && <CircularProgress />}
      {data === null && <Typography>Task with ID {id} not found</Typography>}
      {data && <ChatWrapper />}
    </MainCard>
  )
}

export default Chat
