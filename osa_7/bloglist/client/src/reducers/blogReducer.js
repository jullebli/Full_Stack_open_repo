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
      const removedBlog = action.payload
      return state.filter((blog) => blog.id !== removedBlog.id)
    },
    reformBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
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

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteBlog(blog)
    dispatch(removeBlog(blog))
  }
}

export const updateBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.reform(blog)
    dispatch(reformBlog(updatedBlog))
  }
}

export const { setBlogs, appendBlog, removeBlog, reformBlog } =
  blogSlice.actions

export default blogSlice.reducer
