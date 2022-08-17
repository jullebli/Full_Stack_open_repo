import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: null, color: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return {
        content: action.payload.content,
        color: action.payload.color,
      }
    },
  },
})

//in order to clear timer when new notification is set
let timeoutID
export const createTimedNotification = (content, color, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(setNotification({ content, color }))
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      dispatch(setNotification(initialState))
    }, timeInSeconds * 1000)
  }
}

export const { setNotification, setNotificationColor } =
  notificationSlice.actions

export default notificationSlice.reducer
