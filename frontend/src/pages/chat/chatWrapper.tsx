import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material'
import dayjs from 'dayjs'
import { AudioOutlined, BorderOutlined, SendOutlined } from '@ant-design/icons'
import { formatTimeFrontend } from 'utils/date'
import { MessageBox } from 'react-chat-elements'
import { getFromLocalStorage } from 'utils/localStorageUtils'
import { useTheme } from '@emotion/react'
import 'react-chat-elements/dist/main.css'
import './customStyle.css'
import { MethodHTTP, fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { useDispatch } from 'react-redux'
import { activeItem, openDrawer } from 'store/reducers/menu'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { INITIAL_MESSAGE, MessageType, UserChatEnum } from './types'
import user from './user.png'
import robot from './robot.png'

const { username } = getFromLocalStorage('user')
const scrollToBottom = () => {
  const chatContainer = document.getElementById('chatContainer')
  if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
}

interface ChatWrapperProps {
  speaker: boolean
}

export const ChatWrapper = ({ speaker }: ChatWrapperProps) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const theme: any = useTheme()
  const [listMessages, setListMessages] = React.useState<MessageType[]>([
    INITIAL_MESSAGE,
  ])
  const [message, setMessage] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition()
  const [question, setQuestion] = React.useState(0)
  const [end, setEnd] = React.useState(0)

  const startRecording = () => {
    SpeechRecognition.startListening({ language: 'en-GB', continuous: true })
    setIsRecording(true)
  }

  const stopRecording = () => {
    SpeechRecognition.stopListening()
    setMessage(transcript)
    resetTranscript()
    setIsRecording(false)
  }

  const onMessageSend = () => {
    const messagesWithUserRequest = [
      ...listMessages,
      {
        text: message,
        id: listMessages[listMessages.length - 1].id + 1,
        user: UserChatEnum.USER,
        timestamp: formatTimeFrontend(dayjs().toString()),
      },
    ]
    setListMessages(messagesWithUserRequest)
    setIsProcessing(true)
    setMessage('')

    fetchApi({
      url: endpoints.chat.newMessage,
      method: MethodHTTP.POST,
      body: { id: Number(id), message, question, end },
    })
      .then((response) => {
        if (response) {
          const newMessages = response.message.map(
            (msg: string, index: number) => {
              if (speaker) {
                const utterance = new SpeechSynthesisUtterance(msg)
                utterance.lang = 'en-GB'
                window.speechSynthesis.speak(utterance)
              }

              return {
                text: msg,
                id:
                  messagesWithUserRequest[messagesWithUserRequest.length - 1]
                    .id +
                  1 +
                  index,
                user: UserChatEnum.ROBOT,
                timestamp: formatTimeFrontend(dayjs().toString()),
              }
            }
          )

          setListMessages([...messagesWithUserRequest, ...newMessages])

          if (response.question !== null && response.question !== undefined)
            setQuestion(response.question)
          if (response.end !== null && response.end !== undefined)
            setEnd(response.end)

          if (response.openGraphic) {
            setTimeout(() => {
              navigate(`/graphic/${id}`)
              dispatch(activeItem('programminggraphical'))
            }, 2000)
          }

          if (response.openTasks) {
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

  React.useEffect(() => {
    scrollToBottom()
  }, [listMessages])

  return (
    <div style={{ height: '69vh', position: 'relative' }}>
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
                ? robot
                : user
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
        placeholder={isRecording ? 'Listening...' : 'Type a message...'}
        disabled={isRecording}
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
          <>
            {message && !isProcessing && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onMessageSend()}
                  edge="end"
                  disabled={isProcessing}
                >
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            )}
            {!message && !isRecording && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => startRecording()}
                  edge="end"
                  disabled={
                    isProcessing ||
                    !browserSupportsSpeechRecognition ||
                    !isMicrophoneAvailable
                  }
                >
                  <AudioOutlined />
                </IconButton>
              </InputAdornment>
            )}
            {!message && isRecording && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => stopRecording()}
                  edge="end"
                  disabled={
                    isProcessing ||
                    !browserSupportsSpeechRecognition ||
                    !isMicrophoneAvailable
                  }
                >
                  <BorderOutlined />
                </IconButton>
              </InputAdornment>
            )}
          </>
        }
      />
    </div>
  )
}
