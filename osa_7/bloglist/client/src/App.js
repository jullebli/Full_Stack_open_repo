import { Routes, Route, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import UserPage from './components/UserPage'
import BlogPage from './components/BlogPage'
import Home from './components/Home'
import blogService from './services/blog'
import usersService from './services/usersService'
import Notification from './components/Notification'
import { setUser } from './reducers/userReducer'
import { createTimedNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  //const blogs = useSelector((state) => state.blogs)
  const [users, setUsers] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    usersService.getAll().then((initialUsers) => setUsers(initialUsers))
  }, [])

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken('')
    dispatch(setUser(null))
    setUsername('')
    setPassword('')
    dispatch(createTimedNotification('logout successfull', 'green', 5))
    navigate('/')
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <div>
        {user === null ? null : (
          <p>
            {user.name} logged in{' '}
            <button type='submit' onClick={() => handleLogOut()} id='logOut'>
              logout
            </button>
          </p>
        )}
      </div>
      <Routes>
        <Route path='/users/:id' element={<UserPage users={users} />} />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/blogs/:id' element={<BlogPage />} />
        <Route
          path='/'
          element={
            <Home
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
