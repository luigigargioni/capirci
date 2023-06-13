import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import { USER_GROUP } from 'utils/constants'
import { programming } from './programming'
import { libraries } from './libraries'
import { MenuItem } from './types'
import { management } from './management'

export const getMenuItems = (): MenuItem[] => {
  const { group } = getFromLocalStorage(LocalStorageKey.USER)
  const defaultItems = [programming, libraries]

  return [...defaultItems, management]

  // TODO: restore this for user group management
  if (group === USER_GROUP.MANAGER) return [...defaultItems, management]

  return defaultItems
}
