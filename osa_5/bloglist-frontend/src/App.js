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
  //const loginFormRef = useRef()
  //const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    //console.log('useEffect 1')
    blogService
      .getAll()
      .then(initialBlogs =>
        setBlogs(initialBlogs)
      )
  }, [])

  useEffect(() => {
    //console.log('useEffect 2')
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      //setLoginVisible(false)
    }
  }, [])

  const timedNotification = ({ message }) => {
    //console.log('timedNotification')
    //console.log('timedNotification message[0]', message[0])
    //console.log('timedNotification message[1]', message[1])

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
      //console.log('handleLogin')
      //console.log('loggin in with', username, password)

      try {
        const user = await loginService.login({
          username, password
        })
        //console.log('handleLogin user', user)
        window.localStorage.setItem(
          'loggedBloglistUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        setMessage(['login successful', false])
        //setLoginVisible(false)
      } catch (exception) {
        setMessage(['wrong username or password', true])
      }
    }
  }

  const handleLogOut = () => {
    //console.log('handleLogOut')
    //console.log('logging out ', username, password)

    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
    setMessage(['logout successfull', false])
  }

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {
    //console.log('addBlog')
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
    //console.log('App updateBlog blog', blog)
    //console.log('App updateBlog blog.user.id', blog.user.id)
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
      //console.log('updateBlog response', updatedBlog)
      //setBlogs(blogs.concat(updatedBlog))
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

    //console.log('deleteBlog blog', blog)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        const deletedBlog = await blogService.deleteBlog(blog)
        //console.log('deleteBlog() deletedBlog', deletedBlog)
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
  //console.log('main return')
  //console.log('message[0] before main return', message[0])
  //console.log('message[1] before main return', message[1])

  const loggedInMode = () => {
    //console.log('loggedInMode')
    //console.log('loggedInMode blogs', blogs)
    return (
      <div>
        <p>{user.name} logged in <button type='submit' onClick={() => handleLogOut()}>logout</button></p>
        <div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <h2>Your blogs:</h2>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id} blog={blog}
              updateBlog={updateBlog} deleteBlog={deleteBlog}
              loggedInUser={user} />
          )}
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
        <Togglable buttonLabel='login' id='openLogInForm'>
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
