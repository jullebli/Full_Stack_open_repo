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
    const updatedBlog = await blogService.update(blog)
    dispatch(reformBlog(updatedBlog))
  }
}

export const createComment = (blog, comment) => {
  return async (dispatch) => {
    const commentedBlog = await blogService.comment(blog, comment)
    dispatch(reformBlog(commentedBlog))
  }
}

export const { setBlogs, appendBlog, removeBlog, reformBlog } =
  blogSlice.actions

export default blogSlice.reducer
