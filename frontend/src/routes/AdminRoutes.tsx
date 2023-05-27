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
const GestioneClienti = Loadable(
  lazy(() => import('pages/clienti/gestioneClienti'))
)
const DettaglioCliente = Loadable(
  lazy(() => import('pages/clienti/dettaglioCliente'))
)
const GestioneVeterinari = Loadable(
  lazy(() => import('pages/veterinari/gestioneVeterinari'))
)
const DettaglioVeterinario = Loadable(
  lazy(() => import('pages/veterinari/dettaglioVeterinario'))
)
const DettaglioAnimale = Loadable(
  lazy(() => import('pages/animali/dettaglioAnimale'))
)
const GestioneAnimali = Loadable(
  lazy(() => import('pages/animali/gestioneAnimali'))
)

export const AdminRoutes: RouteObject = {
  path: defaultPath,
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'animali',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneAnimali />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'animale/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioAnimale />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'utenti',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneUtenti />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'utente/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioUtente />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'clienti',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneClienti />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'cliente/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioCliente />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'veterinari',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <GestioneVeterinari />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: 'veterinario/:id',
      element: (
        <ProtectedRoute>
          <RoleRoute>
            <DettaglioVeterinario />
          </RoleRoute>
        </ProtectedRoute>
      ),
    },
  ],
}
