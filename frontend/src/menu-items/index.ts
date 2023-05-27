import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import { USER_ROLE } from 'utils/constants'
import { stampe } from './registro'
import { generale } from './generale'
import { gestione } from './gestione'
import { MenuItem } from './types'
import { avanzate } from './avanzate'

export const getMenuItems = (): MenuItem[] => {
  const { role } = getFromLocalStorage(LocalStorageKey.USER)
  const defaultItems = [generale, gestione, stampe]

  if (role === USER_ROLE.ADMIN) return [...defaultItems, avanzate]

  return defaultItems
}
