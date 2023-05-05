import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
        state.products = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProducts } = productSlice.actions

export default productSlice.reducer