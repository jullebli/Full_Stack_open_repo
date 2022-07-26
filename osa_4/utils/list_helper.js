const middleware = require('./middleware')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (mostLikedBlog, blog) => {
    if (mostLikedBlog.likes < blog.likes) {
      mostLikedBlog = blog
    }
    return mostLikedBlog
  }
  const resultBlog = blogs.reduce(reducer, blogs[0])
  return middleware.blogJSONTrimmer(resultBlog)
}

const mostBlogs = (blogs) => {
  const blogAmountByAuthor =
    blogs
      .reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] + 1 || 1
        return authors
      }, {})

  let mostBlogs = null
  let authorOfMostBlogs = null
  for (const [key, value] of Object.entries(blogAmountByAuthor)) {
    if (mostBlogs < value) {
      mostBlogs = value
      authorOfMostBlogs = key
    }
  }

  const result = authorOfMostBlogs === null
    ? undefined : { author: authorOfMostBlogs, blogs: mostBlogs }

  return result
}

const mostLikes = (blogs) => {
  const likeAmountByAuthor =
    blogs
      .reduce((authors, blog) => {
        authors[blog.author] = authors[blog.author] + blog.likes || blog.likes
        return authors
      }, {})

  let mostLikes = null
  let authorOfMostLikes = null
  for (const [key, value] of Object.entries(likeAmountByAuthor)) {
    if (mostLikes < value) {
      mostLikes = value
      authorOfMostLikes = key
    }
  }

  const result = authorOfMostLikes === null
    ? undefined : { author: authorOfMostLikes, likes: mostLikes }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
