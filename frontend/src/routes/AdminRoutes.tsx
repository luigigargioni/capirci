import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute, RoleRoute } from './ProtectedRoute'

const GestioneUtenti = Loadable(
  lazy(() => import('pages/utenti/gestioneUtenti'))
)
const DettaglioUtente = Loadable(
  lazy(() => import('pages/utenti/dettaglioUtente'))
)

const DettaglioAnimale = Loadable(lazy(() => import('pages/tasks/detailTask')))
const GestioneAnimali = Loadable(lazy(() => import('pages/tasks/listTasks')))

export const ManagerRoutes: RouteObject = {
  path: defaultPath,
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'users',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneAnimali />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'user/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioAnimale />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'robots',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneUtenti />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'robot/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioUtente />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
  ],
}
