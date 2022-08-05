import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TokenState = string

const initialState: TokenState = ''

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken(_state, action: PayloadAction<string>) {
      return action.payload
    },
    unsetToken() {
      return ''
    },
  },
})

export const { setToken, unsetToken } = tokenSlice.actions
export const tokenReducers = tokenSlice.reducer
