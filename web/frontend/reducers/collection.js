import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  collections: [],
  selected: []
}

export const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollectionSelected: (state, action) => {
      state.selected = action.payload;
    },
    setCollections: (state, action) => {
        state.collections = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCollections,setCollectionSelected } = collectionSlice.actions

export default collectionSlice.reducer