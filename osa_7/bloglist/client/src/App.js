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
import { loginUser } from './reducers/userReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navibar from './components/Navibar'
import { Container } from '@mui/material'
//import Typography from '@mui/material/Typography'
//import { blue } from '@mui/material/colors'
import './index.css'

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

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      dispatch(
        createTimedNotification('username or password missing', 'red', 5)
      )
    } else {
      try {
        await dispatch(loginUser({ username, password }))
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
  //in NaviBar also handleLogin?
  return (
    <Container>
      <Navibar handleLogOut={handleLogOut} />
      <Notification />
      <h1>blog app</h1>
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
              handleLogin={handleLogin}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App
