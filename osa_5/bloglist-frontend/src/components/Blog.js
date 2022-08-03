import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showMore, setShowMore] = useState(false)

  const hideWhenShowMore = { display: showMore ? 'none' : '' }
  const showWhenShowMore = { display: showMore ? '' : 'none' }

  const toggleVisibility = () => {
    setShowMore(!showMore)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button style={hideWhenShowMore} onClick={toggleVisibility}>view</button>
      <button style={showWhenShowMore} onClick={toggleVisibility}>hide</button>
      <div style={showWhenShowMore}>
        {blog.url}
        <div>
          likes {blog.likes} <button onClick={() => updateBlog({blog})}>like</button>
        </div>
        {blog.user.name}
      </div>
    </div>
  )
}
export default Blog
