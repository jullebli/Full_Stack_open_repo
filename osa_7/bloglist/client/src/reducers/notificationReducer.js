import { createSlice } from '@reduxjs/toolkit'

const initialState = { content: null, color: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      //console.log('notificationReducer setNotification state', state)
      return {
        content: action.payload.content,
        color: action.payload.color,
      }
    },
    /*setNotificationColor(state, action) {
      console.log('notificationReducer setNotificationColor state', state)
      return { ...state, color: action.payload }
    }, not needed anymore since both content and color in setNotification */
  },
})

//in order to clear timer when new notification is set
let timeoutID
export const createTimedNotification = (content, color, timeInSeconds) => {
  return async (dispatch) => {
    dispatch(setNotification({ content, color }))
    //dispatch(setNotificationColor(color))
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      dispatch(setNotification(initialState))
      //dispatch(setNotificationColor(null))
    }, timeInSeconds * 1000)
  }
}

export const { setNotification, setNotificationColor } =
  notificationSlice.actions

export default notificationSlice.reducer
