import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { UserOutlined, RobotOutlined } from '@ant-design/icons'
import { formatTimeFrontend } from 'utils/date'
import { INITIAL_MESSAGE, UserChatEnum } from './types'

export const ChatWrapper = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = React.useState([INITIAL_MESSAGE])
  const [isTyping, setIsTyping] = React.useState(false)

  const onMessageSend = (text: string) => {
    setMessages([
      ...messages,
      {
        text,
        id: messages.length + 1,
        user: UserChatEnum.USER,
        timestamp: formatTimeFrontend(dayjs().toString()),
      },
    ])
    setIsTyping(true)
    // call api
    setTimeout(() => {
      setMessages([
        ...messages,
        {
          text: 'Hello',
          id: messages.length + 1,
          user: UserChatEnum.ROBOT,
          timestamp: formatTimeFrontend(dayjs().toString()),
        },
      ])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div>
      <h1>Chat wrapper</h1>
    </div>
  )
}
