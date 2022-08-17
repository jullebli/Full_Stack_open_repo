import { Routes, Route, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import Home from './components/Home'
import blogService from './services/blog'
import { setUser } from './reducers/userReducer'
import { createTimedNotification } from './reducers/notificationReducer'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  //console.log('App tila ennen return', tila)

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
    <Routes>
      <Route path='/users' element={<Users handleLogOut={handleLogOut} />} />
      <Route
        path='/'
        element={
          <Home
            handleLogOut={handleLogOut}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        }
      />
    </Routes>
  )
}

export default App
