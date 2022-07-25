const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

console.log('inside blogsRouterfile')

blogsRouter.get('/', (request, response) => {
  console.log('enter blogsRouter get')
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

module.exports = blogsRouter