import dayjs from 'dayjs'
import { formatTimeFrontend } from 'utils/date'

export enum UserChatEnum {
  USER = 'user',
  ROBOT = 'robot',
}

export interface MessageType {
  id: number
  text: string
  user: UserChatEnum
  timestamp: string | null
}

export const INITIAL_MESSAGE: MessageType = {
  id: 0,
  text: 'Hello! Tell me what to do',
  user: UserChatEnum.ROBOT,
  timestamp: formatTimeFrontend(dayjs().toString()),
}
