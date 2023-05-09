import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  selected: []
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductSelected: (state, action) => {
      state.selected = action.payload;
    },
    setProducts: (state, action) => {
        state.products = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProducts, setProductSelected } = productSlice.actions

export default productSlice.reducer