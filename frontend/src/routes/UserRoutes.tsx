import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute } from './ProtectedRoute'

const CambioPassword = Loadable(lazy(() => import('pages/cambioPassword')))

export const UserRoutes: RouteObject = {
  path: defaultPath,
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'cambiopassword',
      element: (
        <ProtectedRoute>
          <CambioPassword />
        </ProtectedRoute>
      ),
    },
  ],
}
