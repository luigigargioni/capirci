import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ServerStatusState {
  noConnection: boolean
  error: boolean
  msgError: string
}

const initialState: ServerStatusState = {
  noConnection: false,
  error: false,
  msgError: '',
}

const serverStatusSlice = createSlice({
  name: 'serverStatus',
  initialState,
  reducers: {
    setServerNoConnection(state) {
      return {
        ...state,
        noConnection: true,
      }
    },
    setServerError(state, action: PayloadAction<string>) {
      return {
        ...state,
        error: true,
        msgError: action.payload,
      }
    },
    hideServerModal() {
      return {
        noConnection: false,
        error: false,
        msgError: '',
      }
    },
  },
})

export const { setServerNoConnection, setServerError, hideServerModal } =
  serverStatusSlice.actions
export const serverStatusReducers = serverStatusSlice.reducer
