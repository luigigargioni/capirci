import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from '@reduxjs/toolkit'
import { tokenReducers, TokenState } from './token'
import { serverStatusReducers, ServerStatusState } from './serverStatus'

export interface RootState {
  serverStatus: ServerStatusState
  token: TokenState
}

export const rootReducer = combineReducers<RootState>({
  serverStatus: serverStatusReducers,
  token: tokenReducers,
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
