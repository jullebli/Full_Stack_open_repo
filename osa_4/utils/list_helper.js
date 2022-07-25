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
    //console.log('mostLikedBlog, blog', mostLikedBlog, blog)
    //console.log('mostLikedBlog.likes, blog.likes', mostLikedBlog.likes, blog.likes)
    if (mostLikedBlog.likes < blog.likes) {
      mostLikedBlog = blog
    }
    return mostLikedBlog
  }
  return blogs.reduce(reducer, blogs[0])
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
