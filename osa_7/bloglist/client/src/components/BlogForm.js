import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }) //if you add comments: [{ comment: 'this is comment'}, { comment: 'also a comment'}]
    //you can create default comments. In model default is []
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div style={{ marginTop: 10 }}>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            variant='filled'
            type='text'
            value={newTitle}
            data-testid='Title'
            id='title'
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <TextField
            label='author'
            variant='filled'
            type='text'
            value={newAuthor}
            data-testid='Author'
            id='author'
            onChange={handleAuthorChange}
          />
        </div>

        <div>
          <TextField
            label='url'
            variant='filled'
            type='text'
            value={newUrl}
            data-testid='Url'
            id='url'
            onChange={handleUrlChange}
          />
        </div>
        <Button variant='contained' color='primary' type='submit' id='create'>
          create
        </Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
