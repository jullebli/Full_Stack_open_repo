import { Routes, Route, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import UserPage from './components/UserPage'
import BlogPage from './components/BlogPage'
import Home from './components/Home'
import blogService from './services/blog'
import usersService from './services/users'
import Notification from './components/Notification'
import { setUser } from './reducers/userReducer'
import { createTimedNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navibar from './components/Navibar'

const App = () => {
  const dispatch = useDispatch()
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
      <Navibar handleLogOut={handleLogOut} />
      <Notification />
      <h2>blog app</h2>
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
