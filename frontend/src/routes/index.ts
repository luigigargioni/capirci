import { useRoutes } from 'react-router-dom'

import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import { USER_ROLE } from 'utils/constants'
import { ManagerRoutes } from './AdminRoutes'
import { UserRoutes } from './UserRoutes'
import { AuthRoutes } from './AuthRoutes'
import { MainRoutes } from './MainRoutes'

export const Routes = () => {
  const { role } = getFromLocalStorage(LocalStorageKey.USER)

  const defaultRoutes = [MainRoutes, AuthRoutes, UserRoutes]
  const routes =
    role === USER_ROLE.ADMIN ? [...defaultRoutes, ManagerRoutes] : defaultRoutes

  return useRoutes(routes)
}
