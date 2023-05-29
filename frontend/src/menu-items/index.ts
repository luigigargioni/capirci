import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import { USER_ROLE } from 'utils/constants'
import { programming } from './programming'
import { libraries } from './libraries'
import { MenuItem } from './types'
import { management } from './management'

export const getMenuItems = (): MenuItem[] => {
  const { role } = getFromLocalStorage(LocalStorageKey.USER)
  const defaultItems = [programming, libraries]

  return [...defaultItems, management]
/*   if (role === USER_ROLE.ADMIN) return [...defaultItems, management]

  return defaultItems */
}
