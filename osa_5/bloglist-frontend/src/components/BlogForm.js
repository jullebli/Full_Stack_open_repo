import { useState } from "react"

const BlogForm = ({ createBlog }) => {
  //console.log('BlogForm')

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    //console.log('handleTitleChange')
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    //console.log('handleAuthorChange')
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    //console.log('handleUrlChange')
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    //console.log('handleAddBlog')
    event.preventDefault()
    createBlog({
      newTitle,
      newAuthor,
      newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            value={newTitle}
            name='Title'
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={newAuthor}
            name='Author'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={newUrl}
            name='Url'
            onChange={handleUrlChange}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm