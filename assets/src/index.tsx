import { ConfigProvider } from 'antd'
import enGB from 'antd/lib/locale/en_GB'
import React, {
  LazyExoticComponent,
  Suspense,
  lazy,
  MemoExoticComponent,
} from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from './style/global'
import { theme } from './style/theme'
import { SWRConfig } from 'swr'
import { swrParams } from './services/api'
import { validateMessages } from './utils/formUtils'
import { Provider } from 'react-redux'
import { store } from './store'

const LoginPage = lazy(() => import('./pages/authentication/index'))
const ChatPage = lazy(() => import('./pages/chat/index'))
const GraphicPage = lazy(() => import('./pages/graphic/index'))
const HomePage = lazy(() => import('./pages/home/index'))

const declarePage = (
  id: string,
  Content: LazyExoticComponent<MemoExoticComponent<() => JSX.Element>>
) => {
  try {
    const element = document.getElementById(id) as HTMLElement
    if (!element) return
    const root = createRoot(element)

    root.render(
      <Suspense fallback={<></>}>
        {/* <React.StrictMode> */}
        <ConfigProvider locale={enGB} form={{ validateMessages }}>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <SWRConfig value={swrParams}>
                <GlobalStyle />
                <Content />
              </SWRConfig>
            </Provider>
          </ThemeProvider>
        </ConfigProvider>
        {/* </React.StrictMode> */}
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
