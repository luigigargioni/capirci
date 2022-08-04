import React, { LazyExoticComponent, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// eslint-disable-next-line import/no-unresolved
const App = lazy(() => import('./App'))

const declarePage = (
  id: string,
  Content: LazyExoticComponent<() => JSX.Element>
) => {
  try {
    const element = document.getElementById(id) as HTMLElement
    const root = createRoot(element)

    root.render(
      <Suspense fallback={<></>}>
        <Content />
      </Suspense>
    )
  } catch (e) {
    console.log(e)
  }
}

declarePage('app', App)
