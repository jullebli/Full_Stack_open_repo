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

//in order to clear timer when new notification is set
let timeoutID
export const setNotification = (content, timeInSeconds) => {
  return async dispatch => {
    dispatch(createNotification(content))
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      dispatch(clearToInitial())
    }, timeInSeconds * 1000)
  }
}

export const { createNotification, clearToInitial } = notificationSlice.actions

export default notificationSlice.reducer
