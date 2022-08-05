import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import blogService from './services/blog'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState([null, null]) //['messageText', error = false/true]
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()
  const loginFormRef = useRef()
  //const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs =>
        setBlogs(initialBlogs)
      )
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

  const timedNotification = ({ message }) => {

    if (!message) {
      return null
    } else {
      setTimeout(() => {
        setMessage([null, null])
      }, 5000)
      return (
        <div>
          <Notification message={message[0]} error={message[1]} />
        </div>
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      setMessage(['username or password missing', true])
    } else {
      try {
        const user = await loginService.login({
          username, password
        })
        window.localStorage.setItem(
          'loggedBloglistUser', JSON.stringify(user)
        )
        loginFormRef.current.toggleVisibility()
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        setMessage(['login successful', false])
      } catch (exception) {
        setMessage(['wrong username or password', true])
      }
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
    setMessage(['logout successfull', false])
    //loginFormRef.current.toggleVisibility()
  }

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const addedBlog = await blogService
        .create(blogObject)
      blogFormRef.current.toggleVisibility()
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
      //setBlogs(blogs.concat(addedBlog)) this does not rerender
      if (addedBlog) {
        setMessage([`a new blog ${addedBlog.title} by ${addedBlog.author}`, false])
      }
    } catch (exception) {
      setMessage([`adding a blog failed. Error message: ${exception.message}`, true])
    }
  }

  const updateBlog = async ({ blog }) => {
    const blogObject = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    try {
      const updatedBlog = await blogService.update(blogObject)
      if (updatedBlog) {
        setMessage([`you liked blog ${updatedBlog.title} by ${updatedBlog.author}`, false])
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
      }
    } catch (exception) {
      setMessage([`updating a blog failed. Error message: ${exception.message}`, true])
    }
  }

  const deleteBlog = async ({ blog }) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        const deletedBlog = await blogService.deleteBlog(blog)
        if (!deletedBlog) {
          setMessage([`you deleted blog ${blog.title} by ${blog.author}`, false])
          const newBlogs = await blogService.getAll()
          setBlogs(newBlogs)
        }
      } catch (exception) {
        setMessage([`deleting the blog failed. Error message: ${exception.message}`, true])
      }
    }
  }

  const loggedInMode = () => {
    return (
      <div>
        <p>{user.name} logged in <button type='submit'
          onClick={() => handleLogOut()} id='logOut'>logout</button></p>
        <div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef} id='createNewBlog'>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <div id='blogListing'>
          <h2>All blogs:</h2>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog}
                updateBlog={updateBlog} deleteBlog={deleteBlog}
                loggedInUser={user} />
            )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {message[0] === null ?
        <Notification message={message[0]} error={message[1]} /> :
        timedNotification({ message })}
      <h2>blogs</h2>
      {user === null ?
        <Togglable buttonLabel='login' ref={loginFormRef} id='openLogInForm'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
        : loggedInMode()}
    </div>
  )
}

export default App
