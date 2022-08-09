import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearToInitial(state, action) {
      return initialState
    }
  }
})

//in order to clear timer when new notification is set
let timerIsSet
export const createNotification = (content) => {
  return (dispatch) => {
    dispatch(setNotification(content))
    if (timerIsSet) {
      clearTimeout(timerIsSet)
    }
    timerIsSet = setTimeout(() => {
      dispatch(clearToInitial())
    }, 5000)
  }
}

export const { setNotification, clearToInitial } = notificationSlice.actions
export default notificationSlice.reducer