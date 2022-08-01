const BlogForm = ({ handleAddBlog, newBlog, setNewBlog }) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={handleAddBlog}>
      <div>
        title:
        <input
          type='text'
          name='Title'
          onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
        />
      </div>
      <div>
        author:
        <input
          type='text'
          name='Author'
          onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
        />
      </div>
      <div>
        url:
        <input
          type='text'
          name='Url'
          onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
        />
      </div>
      <button type='submit'>create</button>
    </form>
  </div>
)

export default BlogForm