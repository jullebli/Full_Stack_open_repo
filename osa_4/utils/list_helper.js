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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
