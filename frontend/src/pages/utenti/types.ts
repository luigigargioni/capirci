import { USER_GROUP } from 'utils/constants'

export interface UserType {
  id: number
  first_name: string
  last_name: string
  email: string
  role: USER_GROUP | null
  active: number
}
