import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute, GroupRoute } from './ProtectedRoute'

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
          <GroupRoute>
            <GestioneAnimali />
          </GroupRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'user/:id',
      element: (
        <ProtectedRoute>
          <GroupRoute>
            <DettaglioAnimale />
          </GroupRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'robots',
      element: (
        <ProtectedRoute>
          <GroupRoute>
            <GestioneUtenti />
          </GroupRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'robot/:id',
      element: (
        <ProtectedRoute>
          <GroupRoute>
            <DettaglioUtente />
          </GroupRoute>
        </ProtectedRoute>
      ),
    },
  ],
}
