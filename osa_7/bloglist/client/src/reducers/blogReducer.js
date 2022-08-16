import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blog'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      //console.log('blogReducer appendBlog action', action)
      state.push(action.payload)
    },
    removeBlog(state, action) {
      console.log('removeBlog action', action)
      return state
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blogSlice.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(blog)
    dispatch(appendBlog(createdBlog))
  }
}

export const { setBlogs, appendBlog, removeBlog, updateBlog } =
  blogSlice.actions

export default blogSlice.reducer
