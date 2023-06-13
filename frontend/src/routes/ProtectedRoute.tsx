import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { UserLoginInterface } from 'pages/login/LoginForm'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { defaultPath, USER_GROUP } from 'utils/constants'
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
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const verifyToken = async () => {
    return fetchApi({
      url: endpoints.auth.verifyToken,
      method: MethodHTTP.POST,
      body: { id: getFromLocalStorage(LocalStorageKey.USER).id },
    }).then((res) => {
      if (!res.authError) {
        const userInfo: UserLoginInterface = {
          id: res.id,
          username: res.username,
          group: res.group as USER_GROUP,
        }
        setToLocalStorage(LocalStorageKey.USER, userInfo)
        setIsAuthenticated(true)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    verifyToken()
  }, [])

  if (isAuthenticated) return children
  return loading ? <LoadingSpinner /> : <Navigate to="/login" replace />
}

export const PublicRoute = ({ children }: ProtectedRouteProps) => {
  const user = getFromLocalStorage(LocalStorageKey.USER)

  if (user) {
    return <Navigate to={defaultPath} replace />
  }

  return children
}

export const GroupRoute = ({ children }: ProtectedRouteProps) => {
  const { role } = getFromLocalStorage(LocalStorageKey.USER)

  if (role !== USER_GROUP.MANAGER) {
    return <Navigate to={defaultPath} replace />
  }

  return children
}
