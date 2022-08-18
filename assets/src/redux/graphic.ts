import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CategoriesEnum } from '../pages/graphic/library'

export interface GraphicState {
  taskStructure: any
  draggingType: CategoriesEnum
}

const initialState: GraphicState = {
  taskStructure: [],
  draggingType: null,
}

const graphicSlice = createSlice({
  name: 'graphic',
  initialState,
  reducers: {
    setTaskStructure(state, action: PayloadAction<any>) {
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
  },
})

export const { setTaskStructure, setDraggingType, resetDraggingType } =
  graphicSlice.actions
export const graphicReducers = graphicSlice.reducer
