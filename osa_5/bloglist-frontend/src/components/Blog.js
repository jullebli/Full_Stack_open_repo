import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, loggedInUser }) => {
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
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button style={hideWhenShowMore}
        onClick={toggleVisibility} data-testid='viewButton' id='viewButton'>view</button>
      <button style={showWhenShowMore}
        onClick={toggleVisibility} id='hide'>hide</button>
      <div style={showWhenShowMore} data-testid='showMoreBlogInfo'>
        {blog.url}
        <div data-testid='likesLine' id='likesLine'>
          likes {blog.likes} <button style={{ background: 'yellow' }}
            onClick={() => updateBlog({ blog })} data-testid='likeButton' id='likeButton'>like</button>
        </div>
        <div id='usernameLine'>
          {blog.user.name}
        </div>
        <div>
          {loggedInUser.username === blog.user.username ?
            <button style={{ color: 'white', background: 'blue' }}
              onClick={() => deleteBlog({ blog })} id='remove'>remove</button>
            : null
          }
        </div>
      </div>
    </div>
  )
}
export default Blog
