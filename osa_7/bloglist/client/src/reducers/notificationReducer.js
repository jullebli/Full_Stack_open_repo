import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: null, color: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return { ...state, content: action.payload }
    },
    setNotificationColor(state, action) {
      return { ...state, color: action.payload }
    },
  },
})

//in order to clear timer when new notification is set
let timeoutID
export const createTimedNotification = (content, color, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(setNotification(content))
    dispatch(setNotificationColor(color))
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      dispatch(setNotification(null))
      dispatch(setNotificationColor(null))
    }, timeInSeconds * 1000)
  }
}

export const { setNotification, setNotificationColor } =
  notificationSlice.actions

export default notificationSlice.reducer
