import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blog'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with', username, password)

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
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    console.log('logging out ', username, password)

    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const unloggedMode = () => (
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


  const loggedInMode = () => (
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

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    const addedBlog = await blogService
      .create(blogObject)

    const newBlogs = await blogService.getAll()
    setBlogs(newBlogs)

  /*catch (exception) {
    setErrorMessage(`creating a blog failed ${exception.message}`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000) */

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
