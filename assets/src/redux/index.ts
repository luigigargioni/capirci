import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { combineReducers } from '@reduxjs/toolkit'
import { tokenReducers, TokenState } from './token'
import { serverStatusReducers, ServerStatusState } from './serverStatus'
import { graphicReducers, GraphicState } from './graphic'

export interface RootState {
  serverStatus: ServerStatusState
  graphic: GraphicState
  token: TokenState
}

export const rootReducer = combineReducers<RootState>({
  serverStatus: serverStatusReducers,
  graphic: graphicReducers,
  token: tokenReducers,
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
