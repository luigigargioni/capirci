import { combineReducers } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'

import { menuReducers, MenuState } from './menu'

export interface RootState {
  menu: MenuState
}

export const rootReducer = combineReducers<RootState>({
  menu: menuReducers,
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
