import anecdoteReducer from '../reducers/anecdoteReducer'
import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from '../reducers/notificationReducer'


const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    notification: notificationReducer
  }
})

export default store