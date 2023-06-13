import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute } from './ProtectedRoute'

const Dashboard = Loadable(lazy(() => import('pages/dashboard/index')))
const RegistroCompilazione = Loadable(
  lazy(() => import('pages/registro/registroCompilazione'))
)
const RegistroNeutro = Loadable(
  lazy(() => import('pages/registro/registroNeutro'))
)
const ListTasks = Loadable(lazy(() => import('pages/tasks/listTasks')))
const GestioneCheckout = Loadable(
  lazy(() => import('pages/prenotazioni/gestioneCheckout'))
)
const GestioneStorico = Loadable(
  lazy(() => import('pages/prenotazioni/gestioneStorico'))
)
const DettaglioPrenotazione = Loadable(
  lazy(() => import('pages/prenotazioni/dettaglioPrenotazione'))
)
const Presenze = Loadable(lazy(() => import('pages/presenze')))
const Servizi = Loadable(lazy(() => import('pages/servizi')))

export const MainRoutes: RouteObject = {
  path: defaultPath,
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: defaultPath,
      element: (
        <ProtectedRoute>
          <ListTasks />
        </ProtectedRoute>
      ),
    },
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: 'tasks',
      element: (
        <ProtectedRoute>
          <ListTasks />
        </ProtectedRoute>
      ),
    },
    {
      path: 'prenotazione/:id',
      element: (
        <ProtectedRoute>
          <DettaglioPrenotazione />
        </ProtectedRoute>
      ),
    },
    {
      path: 'checkout',
      element: (
        <ProtectedRoute>
          <GestioneCheckout />
        </ProtectedRoute>
      ),
    },
    {
      path: 'storico',
      element: (
        <ProtectedRoute>
          <GestioneStorico />
        </ProtectedRoute>
      ),
    },
    {
      path: 'registroneutro',
      element: (
        <ProtectedRoute>
          <RegistroNeutro />
        </ProtectedRoute>
      ),
    },
    {
      path: 'registrocompilazione',
      element: (
        <ProtectedRoute>
          <RegistroCompilazione />
        </ProtectedRoute>
      ),
    },
    {
      path: 'presenze',
      element: (
        <ProtectedRoute>
          <Presenze />
        </ProtectedRoute>
      ),
    },
    {
      path: 'servizi/:id',
      element: (
        <ProtectedRoute>
          <Servizi />
        </ProtectedRoute>
      ),
    },
    {
      path: 'servizi',
      element: (
        <ProtectedRoute>
          <Servizi />
        </ProtectedRoute>
      ),
    },
  ],
}
