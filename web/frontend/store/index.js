import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../reducers/product'
import collectionReducer from '../reducers/collection'
import tagReducer from '../reducers/tag'

export const store = configureStore({
  reducer: {
    products: productReducer,
    collections: collectionReducer,
    tags: tagReducer
  },
})