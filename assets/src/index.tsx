import React, { LazyExoticComponent, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './style/global'
import { theme } from './style/theme'

const LoginPage = lazy(() => import('./pages/authentication/index'))
const ChatPage = lazy(() => import('./pages/chat/index'))
const GraphicPage = lazy(() => import('./pages/graphic/index'))
const HomePage = lazy(() => import('./pages/home/index'))

const declarePage = (
  id: string,
  Content: LazyExoticComponent<() => JSX.Element>
) => {
  try {
    const element = document.getElementById(id) as HTMLElement
    if (!element) return
    const root = createRoot(element)

    root.render(
      <Suspense fallback={<></>}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Content />
        </ThemeProvider>
      </Suspense>
    )
  } catch (e) {
    console.log(e)
  }
}

declarePage('LoginPage', LoginPage)
declarePage('ChatPage', ChatPage)
declarePage('GraphicPage', GraphicPage)
declarePage('HomePage', HomePage)
