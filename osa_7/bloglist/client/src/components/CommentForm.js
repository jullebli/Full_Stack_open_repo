import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createTimedNotification } from '../reducers/notificationReducer'
import { createComment } from '../reducers/blogReducer'

const CommentForm = ({ commentedBlog }) => {
  const dispatch = useDispatch()
  const [commentText, setCommentText] = useState('')

  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value)
  }

  const addComment = async (event) => {
    event.preventDefault()

    try {
      await dispatch(createComment(commentedBlog, { comment: commentText }))
      dispatch(
        createTimedNotification(
          `you commented blog ${commentedBlog.title} by ${commentedBlog.author}`,
          'green',
          5
        )
      )
    } catch (exception) {
      dispatch(
        createTimedNotification(
          `Commenting failed. Error message: ${exception.message}`,
          'red',
          5
        )
      )
    }
  }

  return (
    <div id='blogPageCommentSection' style={{ marginTop: 10 }}>
      <h3>comments</h3>
      <form style={{ margin: 5 }} onSubmit={addComment}>
        <input
          type='text'
          value={commentText}
          onChange={handleCommentTextChange}
        />
        <button type='submit' style={{ margin: 5 }}>
          add comment
        </button>
      </form>
    </div>
  )
}

export default CommentForm
