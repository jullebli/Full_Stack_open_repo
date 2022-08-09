import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    clearToInitial(state, action) {
      return initialState
    }
  }
})

export const { createNotification, clearToInitial } = notificationSlice.actions
export default notificationSlice.reducer