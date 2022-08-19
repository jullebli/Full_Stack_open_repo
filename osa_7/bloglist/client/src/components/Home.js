import LoginForm from './LoginForm'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import BlogList from './BlogList'
import { useDispatch, useSelector } from 'react-redux'

import { useRef } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { createTimedNotification } from '../reducers/notificationReducer'

const Home = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const loginFormRef = useRef()
  const blogFormRef = useRef()
  //const tila = useSelector((state) => state) //to see the whole state to debug, replaced by subscribe

  const addBlog = async ({ title, author, url, comments }) => {
    const blogObject = {
      title,
      author,
      url,
      comments,
    }

    try {
      //with await an error notification will be set, not a new blog undefined by undefined
      await dispatch(createBlog(blogObject))
      blogFormRef.current.toggleVisibility()
      dispatch(
        createTimedNotification(
          `a new blog ${blogObject.title} by ${blogObject.author}`,
          'green',
          5
        )
      )
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

  return (
    <div>
      {user === null ? (
        <Togglable
          buttonLabel='login'
          showAtFirst={true}
          ref={loginFormRef}
          idForButton='openLogInForm'
        >
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <Togglable
            buttonLabel='create new blog'
            showAtFirst={false}
            ref={blogFormRef}
            idForButton='createNewBlog'
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
          <BlogList />
        </div>
      )}
    </div>
  )
}

export default Home
