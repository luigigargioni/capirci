import { createLogger } from 'redux-logger'
import { rootReducer } from './redux'
import { ENV_TYPE } from './utils'
import { configureStore } from '@reduxjs/toolkit'

const loggerMiddleware = createLogger({
  collapsed: true,
  duration: true,
})

export const isDevelopment = process.env.NODE_ENV === ENV_TYPE.DEVELOPMENT
console.log(process.env.NODE_ENV)

export const store = configureStore({
  reducer: rootReducer,
  devTools: isDevelopment,
  middleware: isDevelopment ? [loggerMiddleware] : [],
})
