import anecdoteReducer from '../reducers/anecdoteReducer'
import { configureStore } from '@reduxjs/toolkit'


const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer
  }
})

export default store