import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootDndInterface } from '../pages/graphic/dndElements'
import { CategoriesEnum } from '../pages/graphic/library'

export interface GraphicState {
  taskStructure: RootDndInterface
  draggingType: CategoriesEnum
  isSourceLibrary: boolean
}

const initialState: GraphicState = {
  taskStructure: [],
  draggingType: null,
  isSourceLibrary: false,
}

const graphicSlice = createSlice({
  name: 'graphic',
  initialState,
  reducers: {
    setTaskStructure(state, action: PayloadAction<RootDndInterface>) {
      return {
        ...state,
        taskStructure: action.payload,
      }
    },
    setDraggingType(state, action: PayloadAction<CategoriesEnum>) {
      return {
        ...state,
        draggingType: action.payload,
      }
    },
    resetDraggingType(state) {
      return {
        ...state,
        draggingType: null,
      }
    },
    setSourceLibrary(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isSourceLibrary: action.payload,
      }
    },
  },
})

export const {
  setTaskStructure,
  setDraggingType,
  resetDraggingType,
  setSourceLibrary,
} = graphicSlice.actions
export const graphicReducers = graphicSlice.reducer
