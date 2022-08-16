import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { createTimedNotification } from './reducers/notificationReducer'
import {
  createBlog,
  initializeBlogs,
  deleteBlog,
  updateBlog,
} from './reducers/blogReducer'

import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  //const tila = useSelector((state) => state) //to see the whole state to debug
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    } else {
      loginFormRef.current.toggleVisibility()
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      dispatch(
        createTimedNotification('username or password missing', 'red', 5)
      )
    } else {
      try {
        const user = await loginService.login({
          username,
          password,
        })
        window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
        loginFormRef.current.toggleVisibility()
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        dispatch(createTimedNotification('login successful', 'green', 5))
      } catch (exception) {
        dispatch(
          createTimedNotification('wrong username or password', 'red', 5)
        )
      }
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
    dispatch(createTimedNotification('logout successfull', 'green', 5))
    //loginFormRef.current.toggleVisibility()
  }

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    try {
      await dispatch(createBlog(blogObject))
      blogFormRef.current.toggleVisibility()
      dispatch(
        createTimedNotification(
          `a new blog ${blogObject.title} by ${blogObject.author}`,
          'green',
          5
        )
      )
    } catch (exception) {
      dispatch(
        createTimedNotification(
          `adding a blog failed. Error message: ${exception.message}`,
          'red',
          5
        )
      )
    }
  }

  const likeBlog = async ({ blog }) => {
    const blogObject = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    try {
      await dispatch(updateBlog(blogObject))
      dispatch(
        createTimedNotification(
          `you liked blog ${blogObject.title} by ${blogObject.author}`,
          'green',
          5
        )
      )
    } catch (exception) {
      dispatch(
        createTimedNotification(
          `updating a blog failed. Error message: ${exception.message}`,
          'green',
          5
        )
      )
    }
  }

  const handleDeleteBlog = async ({ blog }) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await dispatch(deleteBlog(blog))
        dispatch(
          createTimedNotification(
            `you deleted blog ${blog.title} by ${blog.author}`,
            'green',
            5
          )
        )
      } catch (exception) {
        dispatch(
          createTimedNotification(
            `deleting the blog failed. Error message: ${exception.message}`,
            'red',
            5
          )
        )
      }
    }
  }

  const BlogList = () => {
    return (
      <div>
        <p>
          {user.name} logged in{' '}
          <button type='submit' onClick={() => handleLogOut()} id='logOut'>
            logout
          </button>
        </p>
        <div>
          <Togglable
            buttonLabel='create new blog'
            ref={blogFormRef}
            idForButton='createNewBlog'
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <div id='blogListing'>
          <h2>All blogs:</h2>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={likeBlog}
                deleteBlog={handleDeleteBlog}
                loggedInUser={user}
              />
            ))}
        </div>
      </div>
    )
  }

  //console.log('App tila ennen return', tila)
  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      {user === null ? (
        <Togglable
          buttonLabel='login'
          ref={loginFormRef}
          idForButton='openLogInForm'
        >
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <BlogList />
      )}
    </div>
  )
}

export default App
