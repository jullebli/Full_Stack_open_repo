const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    response.status(401)
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
  }
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    response.status(400).json({ error: 'blog not found' })
  } else if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json(
      { error: 'user not authorized to delete this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog =
  {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  }
  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(savedBlog)
})

module.exports = blogsRouter