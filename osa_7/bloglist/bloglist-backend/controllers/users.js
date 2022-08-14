const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1 })
  //another way: .populate('blogs', { author: 1, title: 1, url: 1, likes: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  /* another way:
  if (!password || password.length<3) {
    return response.status(400).json({
      error: 'invalid password'
    })
  }
  */

  if (password === undefined) {
    response.status(400).json({ error: 'password is required' })
  } else if (password.length < 3) {
    response.status(400).json({ error: 'password must be at least 3 characters long' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // username uniqueness "checked in validator" in user model
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter