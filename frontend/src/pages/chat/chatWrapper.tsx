import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import dayjs from 'dayjs'
import { SendOutlined } from '@ant-design/icons'
import { formatTimeFrontend } from 'utils/date'
import { MessageBox } from 'react-chat-elements'
import { getFromLocalStorage } from 'utils/localStorageUtils'
import { useTheme } from '@emotion/react'
import 'react-chat-elements/dist/main.css'
import './customStyle.css'
import { devServerUrl } from 'utils/constants'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { useDispatch } from 'react-redux'
import { activeItem, openDrawer } from 'store/reducers/menu'
import { INITIAL_MESSAGE, MessageType, UserChatEnum } from './types'

const { username } = getFromLocalStorage('user')
const chatContainer = document.getElementById('chatContainer')

export const ChatWrapper = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme: any = useTheme()
  const [listMessages, setListMessages] = React.useState<MessageType[]>([
    INITIAL_MESSAGE,
  ])
  const [message, setMessage] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [question, setQuestion] = React.useState(0)
  const [end, setEnd] = React.useState(0)

  const onMessageSend = async () => {
    const messagesWithUserRequest = [
      ...listMessages,
      {
        text: message,
        id: listMessages[listMessages.length - 1].id + 1,
        user: UserChatEnum.USER,
        timestamp: formatTimeFrontend(dayjs().toString()),
      },
    ]
    await setListMessages(messagesWithUserRequest)
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
    setIsProcessing(true)
    setMessage('')

    fetchApi({
      url: endpoints.chat.newMessage,
      method: MethodHTTP.POST,
      body: { id: Number(id), message, question, end },
    })
      .then(async (response) => {
        if (response) {
          await setListMessages([
            ...messagesWithUserRequest,
            {
              text: response.message,
              id:
                messagesWithUserRequest[messagesWithUserRequest.length - 1].id +
                1,
              user: UserChatEnum.ROBOT,
              timestamp: formatTimeFrontend(dayjs().toString()),
            },
          ])

          // TODO: fix scroll
          if (chatContainer)
            chatContainer.scrollTop = chatContainer.scrollHeight

          setQuestion(response.question)
          setEnd(response.end)

          if (response.openGraphic) {
            setTimeout(() => {
              navigate(`/graphic/${id}`)
              dispatch(activeItem('graphic'))
            }, 2000)
          }

          if (response.endTasks) {
            setTimeout(() => {
              navigate(`/tasks/${id}`)
              dispatch(activeItem('tasks'))
              dispatch(openDrawer(true))
            }, 2000)
          }
        }
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <div style={{ height: '76vh', position: 'relative' }}>
      <div style={{ overflow: 'auto', height: '90%' }} id="chatContainer">
        {listMessages.map((msg) => (
          <MessageBox
            position={msg.user === UserChatEnum.ROBOT ? 'left' : 'right'}
            title={msg.user === UserChatEnum.ROBOT ? 'Robot' : username}
            type="text"
            text={msg.text}
            date={new Date()}
            dateString={msg.timestamp || ''}
            id={msg.id}
            key={msg.id}
            focus={false}
            titleColor={
              msg.user === UserChatEnum.ROBOT
                ? theme.palette.success.main
                : theme.palette.primary.main
            }
            forwarded={false}
            replyButton={false}
            removeButton={false}
            notch
            retracted={false}
            status="sent"
            avatar={
              msg.user === UserChatEnum.ROBOT
                ? `${devServerUrl}/src/pages/chat/robot.png`
                : `${devServerUrl}/src/pages/chat/user.png`
            }
            styles={
              msg.user === UserChatEnum.ROBOT
                ? {
                    backgroundColor: theme.palette.success.lighter,
                  }
                : {
                    backgroundColor: theme.palette.primary.lighter,
                  }
            }
            notchStyle={
              msg.user === UserChatEnum.ROBOT
                ? {
                    fill: theme.palette.success.lighter,
                  }
                : {
                    fill: theme.palette.primary.lighter,
                  }
            }
          />
        ))}
      </div>
      <OutlinedInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        fullWidth
        style={{
          position: 'absolute',
          bottom: 0,
          marginTop: '1rem',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onMessageSend()
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => onMessageSend()}
              edge="end"
              disabled={!message || isProcessing}
            >
              <SendOutlined />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  )
}
