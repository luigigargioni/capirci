import { CircularProgress, Typography } from '@mui/material'
import { MainCard } from 'components/MainCard'
import { TaskDetailType } from 'pages/tasks/types'
import React from 'react'
import { useParams } from 'react-router-dom'
import { endpoints } from 'services/endpoints'
import useSWR from 'swr'
import { SoundOutlined } from '@ant-design/icons'
import { Palette } from 'themes/palette'
import { ChatWrapper } from './chatWrapper'

const Chat = () => {
  const { id } = useParams()
  const [speaker, setSpeaker] = React.useState(false)
  const themePalette = Palette('light')

  const { data, isLoading } = useSWR<TaskDetailType, Error>({
    url: endpoints.home.libraries.task,
    body: { id },
  })

  const title = data ? `Chat to create the task: "${data.name}"` : ''

  return (
    <MainCard
      title={title}
      customElement={
        <SoundOutlined
          onClick={() => setSpeaker(!speaker)}
          style={{
            color: speaker
              ? themePalette.palette.primary.main
              : themePalette.palette.error.main,
            fontSize: '2em',
          }}
        />
      }
    >
      {isLoading && <CircularProgress />}
      {data === null && <Typography>Task with ID {id} not found</Typography>}
      {data && <ChatWrapper speaker={speaker} />}
    </MainCard>
  )
}

export default Chat
