import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState([null, null]) //['messageText', error = false/true]
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    console.log('useEffect 1')
    blogService
      .getAll()
      .then(initialBlogs =>
        setBlogs(initialBlogs)
      )
  }, [])

  useEffect(() => {
    console.log('useEffect 2')
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const timedNotification = ({ message }) => {
    console.log('timedNotification')
    console.log('timedNotification message[0]', message[0])
    console.log('timedNotification message[1]', message[1])

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
    console.log('handleLogin')
    event.preventDefault()
    //console.log('loggin in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(['login successful', false])
    } catch (exception) {
      setMessage(['wrong username or password', true])
    }
  }

  const handleLogOut = () => {
    console.log('handleLogOut')
    console.log('logging out ', username, password)

    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
    setMessage(['logout successfull', false])
  }

  const unloggedMode = () => {
    console.log('unloggedMode')
    return (
      <div>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='text'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }


  const loggedInMode = () => {
    console.log('loggedInMode')
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button type='submit' onClick={() => handleLogOut()}>logout</button></p>

        {blogs.filter(blog => blog.user.name === user.name)
          .map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        <div>
          <BlogForm addBlog={addBlog} />
        </div>
      </div>
    )
  }

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {
    console.log('addBlog')
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      const addedBlog = await blogService
        .create(blogObject)

      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
      if (addedBlog) {
        setMessage([`a new blog ${addedBlog.title} by ${addedBlog.author}`, false])
      }

    } catch (exception) {
      setMessage([`adding a blog failed. Error message: ${exception.message}`, true])
    }
  }
  console.log('main return')
  console.log('message[0] before main return', message[0])
  console.log('message[1] before main return', message[1])
  return (
    <div>
      {message[0] === null ?
        <Notification message={message[0]} error={message[1]} /> :
        timedNotification({ message })}
      {user === null ?
        unloggedMode() :
        loggedInMode()}
    </div>
  )
}

export default App
