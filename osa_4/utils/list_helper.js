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

        //console.log('authors[blog.author]', authors[blog.author])
        //console.log('authors', authors)
        return authors
      }, {})

  //console.log('blogAmountByAuthor inside mostBlogs', blogAmountByAuthor)

  let mostBlogs = null
  let authorOfMostBlogs = null
  for (const [key, value] of Object.entries(blogAmountByAuthor)) {
    //console.log('key, value', key, value)
    if (mostBlogs < value) {
      mostBlogs = value
      authorOfMostBlogs = key
    }
  }

  const result = authorOfMostBlogs === null
    ? undefined : { 'author': authorOfMostBlogs, 'blogs': mostBlogs }
  //console.log('mostBlogs result', result)
  return result
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
