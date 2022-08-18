import LoginForm from './LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { useRef } from 'react'
import Togglable from './Togglable'
import { createTimedNotification } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'

import { loginUser } from '../reducers/userReducer'

const Home = ({ username, password, setUsername, setPassword }) => {
  const dispatch = useDispatch()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const blogFormRef = useRef()
  const loginFormRef = useRef()
  //const tila = useSelector((state) => state) //to see the whole state to debug, replaced by subscribe

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

  const addBlog = async ({ newTitle, newAuthor, newUrl }) => {
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
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

  const BlogList = () => {
    return (
      <div>
        <div>
          <Togglable
            buttonLabel='create new blog'
            showAtFirst={false}
            ref={blogFormRef}
            idForButton='createNewBlog'
          >
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <div id='blogListing'>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
        </div>
      </div>
    )
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
        <BlogList />
      )}
    </div>
  )
}

export default Home
