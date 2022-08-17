import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blog'

let initialState = null

const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
if (loggedUserJSON) {
  initialState = JSON.parse(loggedUserJSON)
  blogService.setToken(initialState.token)
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const loginUser = ({ username, password }) => {
  return async (dispatch) => {
    const loggedUser = await loginService.login({ username, password })
    if (loggedUser) {
      dispatch(setUser(loggedUser))
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedUser)
      )
    }
  }
}

export const { setUser } = userSlice.actions

export default userSlice.reducer
