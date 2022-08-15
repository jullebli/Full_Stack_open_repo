import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { createTimedNotification } from './reducers/notificationReducer'

import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const dispatch = useDispatch()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()
  const loginFormRef = useRef()
  //const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs))
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
      const addedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
      //setBlogs(blogs.concat(addedBlog)) this does not rerender
      if (addedBlog) {
        dispatch(
          createTimedNotification(
            `a new blog ${addedBlog.title} by ${addedBlog.author}`,
            'green',
            5
          )
        )
      }
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

  const updateBlog = async ({ blog }) => {
    const blogObject = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    try {
      const updatedBlog = await blogService.update(blogObject)
      if (updatedBlog) {
        dispatch(
          createTimedNotification(
            `you liked blog ${updatedBlog.title} by ${updatedBlog.author}`,
            'green',
            5
          )
        )
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
      }
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

  const deleteBlog = async ({ blog }) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        const deletedBlog = await blogService.deleteBlog(blog)
        if (!deletedBlog) {
          dispatch(
            createTimedNotification(
              `you deleted blog ${blog.title} by ${blog.author}`,
              'green',
              5
            )
          )
          const newBlogs = await blogService.getAll()
          setBlogs(newBlogs)
        }
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

  const loggedInMode = () => {
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
            id='createNewBlog'
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <div id='blogListing'>
          <h2>All blogs:</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                loggedInUser={user}
              />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      {user === null ? (
        <Togglable buttonLabel='login' ref={loginFormRef} id='openLogInForm'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        loggedInMode()
      )}
    </div>
  )
}

export default App
