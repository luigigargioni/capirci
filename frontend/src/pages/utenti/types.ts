import { USER_ROLE } from 'utils/constants'

export interface UserType {
  id: number
  first_name: string
  last_name: string
  email: string
  role: USER_ROLE | null
  active: number
}
