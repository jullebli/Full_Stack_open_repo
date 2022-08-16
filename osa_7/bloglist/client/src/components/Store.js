import notificationReducer from '../reducers/notificationReducer'
import blogReducer from '../reducers/blogReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
})

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

export default store
