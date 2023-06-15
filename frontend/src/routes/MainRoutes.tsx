import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

import { Loadable } from 'components/Loadable'
import { MainLayout } from 'layout/MainLayout'
import { defaultPath } from 'utils/constants'
import { ProtectedRoute } from './ProtectedRoute'

const ListTasks = Loadable(lazy(() => import('pages/tasks/listTasks')))
const DetailTask = Loadable(lazy(() => import('pages/tasks/detailTask')))
const ListObjects = Loadable(lazy(() => import('pages/objects/listObjects')))
const DetailObject = Loadable(lazy(() => import('pages/objects/detailObject')))

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
      path: 'tasks',
      element: (
        <ProtectedRoute>
          <ListTasks />
        </ProtectedRoute>
      ),
    },
    {
      path: 'task/:id',
      element: (
        <ProtectedRoute>
          <DetailTask />
        </ProtectedRoute>
      ),
    },
    {
      path: 'objects',
      element: (
        <ProtectedRoute>
          <ListObjects />
        </ProtectedRoute>
      ),
    },
    {
      path: 'object/:id',
      element: (
        <ProtectedRoute>
          <DetailObject />
        </ProtectedRoute>
      ),
    },
  ],
}
