const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  //const body = request.body
  const user = request.user

  if (!user) {
    response.status(401).end()
  } else {
    /*
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      //likes: body.likes,
      user: user._id
    }) */
    //another way: const blog = new Blog({ ...request.body, user: user.id })
    const blog = new Blog({ ...request.body, user: user.id })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
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
  //console.log('controller delete request.user', request.user)
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!user) {
    response.status(401).end()
  } else if (!blog) {
    response.status(400).json({ error: 'blog not found' })
  } else if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json(
      { error: 'no authorization to delete this blog' })
  }

  /* another way:
  if (!blogToDelete ) {
    return response.status(204).end()
  }

  if ( blogToDelete.user && blogToDelete.user.toString() !== request.user.id ) {
    return response.status(401).json({
      error: 'only the creator can delete a blog'
    })
  }
  */
})

blogsRouter.put('/:id', async (request, response) => {
  //console.log('controller put, request.body', request.body)
  //console.log('controller put request-params.id', request.params.id)
  /*
  const blog =
  {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    //user: request.body.user
  }
  //another way: const blog = request.body */
  const blog = request.body
  //console.log('controller put blog', blog)

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

  response.json(updatedBlog)
})

module.exports = blogsRouter