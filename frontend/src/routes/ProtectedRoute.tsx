import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { UserLoginInterface } from 'pages/login/LoginForm'
import { fetchApi } from 'services/api'
import { endpoints } from 'services/endpoints'
import { defaultPath, USER_ROLE } from 'utils/constants'
import {
  getFromLocalStorage,
  LocalStorageKey,
  setToLocalStorage,
} from 'utils/localStorageUtils'
import { LoadingSpinner } from 'components/loadingSpinner'

interface ProtectedRouteProps {
  children: JSX.Element
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)

/*   const verifyToken = async () => {
    return fetchApi({
      mod: endpoints.user.verifyToken.mod,
      fnz: endpoints.user.verifyToken.fnz,
    }).then((res) => {
      if (res) {
        const userInfo: UserLoginInterface = {
          id: res.id,
          email: res.email,
          first_name: res.first_name,
          last_name: res.last_name,
          role: res.role as USER_ROLE,
        }
        setToLocalStorage(LocalStorageKey.USER, userInfo)
        setIsAuthenticated(true)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    verifyToken()
  }, []) */

  if (isAuthenticated) return children
  return loading ? <LoadingSpinner /> : <Navigate to="/login" replace />
}

export const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const token = getFromLocalStorage(LocalStorageKey.TOKEN)

  if (token) {
    return <Navigate to={defaultPath} replace />
  }

  return children
}

export const RoleRoute = ({ children }: ProtectedRouteProps) => {
  const { role } = getFromLocalStorage(LocalStorageKey.USER)

  if (role !== USER_ROLE.ADMIN) {
    return <Navigate to={defaultPath} replace />
  }

  return children
}
