import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateBlog } from '../reducers/blogReducer'
import { createTimedNotification } from '../reducers/notificationReducer'
import { deleteBlog } from '../reducers/blogReducer'
import CommentForm from './CommentForm'

const BlogPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedInUser = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)

  if (!blogs) {
    return <div>Blog is null</div>
  }

  const id = useParams().id
  const pageBlog = blogs.find((blog) => blog.id === id)

  const likeBlog = async (blog) => {
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    try {
      await dispatch(updateBlog(blogObject))
      dispatch(
        createTimedNotification(
          `you liked blog ${blogObject.title} by ${blogObject.author}`,
          'green',
          5
        )
      )
    } catch (exception) {
      dispatch(
        createTimedNotification(
          `liking a blog failed. Error message: ${exception.message}`,
          'red',
          5
        )
      )
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await dispatch(deleteBlog(blog))
        dispatch(
          createTimedNotification(
            `you deleted blog ${blog.title} by ${blog.author}`,
            'green',
            5
          )
        )
        navigate('/')
      } catch (exception) {
        dispatch(
          createTimedNotification(
            `deleting the blog failed. Error message: ${exception.message}`,
            'red',
            5
          )
        )
      }
    }
  }

  const BlogInformation = () => {
    if (!pageBlog) {
      return null
    }
    return (
      <div className='coloredText'>
        <div id='blogInformation'>
          <h2>
            <span id='blogPageTitle'>{pageBlog.title}, </span>
            <span id='blogPageAuthor'>{pageBlog.author}</span>
          </h2>
          <a href={pageBlog.url} id='blogPageUrl'>
            {pageBlog.url}
          </a>
          <div id='blogPageLikesLine'>
            {pageBlog.likes} likes{' '}
            <button
              style={{ background: 'yellow' }}
              onClick={() => likeBlog(pageBlog)}
              data-testid='likeButton'
              id='likeButton'
            >
              like
            </button>
          </div>
          added by {pageBlog.user.name}
          <div>
            {loggedInUser.username === pageBlog.user.username ? (
              <button
                style={{ color: 'white', background: 'blue' }}
                onClick={() => handleDeleteBlog(pageBlog)}
                id='remove'
              >
                remove
              </button>
            ) : null}
          </div>
        </div>
        <CommentForm commentedBlog={pageBlog} />
        <ul>
          {pageBlog.comments.map((commentObject) => (
            <li key={commentObject.comment}>{commentObject.comment}</li>
          ))}
        </ul>
      </div>
    )
  }

  return <div>{pageBlog === null ? null : <BlogInformation />}</div>
}

export default BlogPage
