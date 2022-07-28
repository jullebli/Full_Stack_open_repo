const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    next()
    return authorization.substring(7)
  }
  return next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    return request.user
  }
  next()
}

const blogJSONTrimmer = (blog) => {
  if (blog) {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes
    }
  } else {
    return undefined
  }
}


module.exports = {
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  blogJSONTrimmer
}