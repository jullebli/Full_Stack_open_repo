const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user

  if (!user) {
    response.status(401).json({ error: 'only logged in users can add blogs' })
  } else {
    const blog = new Blog({ ...request.body, user: user.id })

    const savedBlog = await blog.save()
    //populate because blogReducer createBlog only added user id
    savedBlog.populate('user', { username: 1, name: 1 })
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
    response.status(401).json({ error: 'no authorization to delete this blog' })
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
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  //this solution will not add comments to blogs listed in 3003/api/users
  if (!request.body) {
    response.status(400).json({ error: 'comment cannot be empty' })
  }
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })

  blog.comments = blog.comments.concat(request.body)
  const commentedBlog = await blog.save()

  if (!commentedBlog) {
    response.status(404).json({ error: 'commenting failed' })
  }
  response.status(200).json(commentedBlog)
})

module.exports = blogsRouter
