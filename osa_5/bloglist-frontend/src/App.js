import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const unloggedMode = () => {
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
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        {blogs.filter(blog => blog.user.name === user.name)
          .map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} />

      {user === null ?
        unloggedMode() :
        loggedInMode()}
    </div>
  )
}

export default App

//{user === null ? <h2>User null</h2> : <h2>User not null</h2>}