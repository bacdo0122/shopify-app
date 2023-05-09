import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tags: [],
  selected: []
}

export const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTagSelected: (state, action) => {
      state.selected = action.payload;
    },
    setTags: (state, action) => {
        state.tags = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTags,setTagSelected } = tagSlice.actions

export default tagSlice.reducer