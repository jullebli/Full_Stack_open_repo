import { createSlice } from "@reduxjs/toolkit"

const initialState = [
    'initial notification'
]

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      const notification = action.payload
      state.push({
        notification
      })
    }
  }
})

export const { createNotification } = notificationSlice.actions
export default notificationSlice.reducer