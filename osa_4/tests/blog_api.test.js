const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(6)
})

test('blog ids are in correct format in database', async () => {
  const response = await api.get('/api/blogs')

  for (let blog of response.body) {
    expect(blog.id).toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const blogsAtBeginning = await helper.blogsInDb()

  const newBlog = {
    title: 'Python for dummies',
    author: 'Mysterious coders',
    url: 'www.notarealaddress.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(x => x.title)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length + 1)
  expect(titles).toContain('Python for dummies')

})

test('blog will have 0 likes if not defined', async () => {
  const newBlog = {
    title: 'Python for dummies',
    author: 'Mysterious coders',
    url: 'www.notarealaddress.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const addedBlog = await Blog.findOne({ title: 'Python for dummies' })
  const likes = addedBlog.likes
  expect(likes).toEqual(0)
})

test('blog without title will not be added', async () => {
  const newBlog = {
    author: 'Mysterious coders',
    url: 'www.notarealaddress.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  const authors = response.body.map(x => x.author)
  const urls = response.body.map(x => x.url)

  expect(authors).not.toContain('Mysterious coders')
  expect(urls).not.toContain('www.notarealaddress.com')
})

test('blog without url and title will not be added', async () => {
  const newBlog = {
    author: 'Mysterious coders',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  const authors = response.body.map(x => x.author)

  expect(authors).not.toContain('Mysterious coders')
})

test('valid id will delete blog from database', async () => {
  const blogsAtBeginning = await helper.blogsInDb()
  const someBlogInDb = await Blog.findOne(helper.initialBlogs[0])
  const toBeDeletedId = someBlogInDb.id

  await api
    .delete(`/api/blogs/${toBeDeletedId}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(x => x.title)
  const ids = response.body.map(x => x.id)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length - 1)
  expect(titles).not.toContain(helper.initialBlogs[0].title)
  expect(ids).not.toContain(toBeDeletedId)

})

test('deleting with invalid id return code 400 and none is deleted', async () => {
  const blogsAtBeginning = await helper.blogsInDb()

  await api
    .delete('/api/blogs/someWeirdId')
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length)

})

test('blog can be updated', async () => {
  const blog = await Blog.findOne(helper.initialBlogs[1])
  const toBeUpdatedId = blog.id

  const updatedBlog = {
    title: 'Updated title',
    author: 'Updated author',
    url: 'Updated url',
    likes: blog.likes + 5
  }

  await api
    .put(`/api/blogs/${toBeUpdatedId}`)
    .send(updatedBlog)
    .expect(200)

  const response = await api.get(`/api/blogs/${toBeUpdatedId}`)
  const id = response.body.id
  const title = response.body.title
  const author = response.body.author
  const url = response.body.url
  const likes = response.body.likes

  expect(id).toEqual(toBeUpdatedId)
  expect(title).toEqual('Updated title')
  expect(author).toEqual('Updated author')
  expect(url).toEqual('Updated url')
  expect(likes).toEqual(blog.likes + 5)

})

test('updating with invalid id returns code 400 and blogs not updated', async () => {
  const blogsAtBeginning = await helper.blogsInDb()

  const blog = {
    title: 'Updated title',
    author: 'Updated author',
    url: 'Updated url',
    likes: 5000
  }

  await api
    .put('/api/blogs/invalidId')
    .send(blog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toEqual(blogsAtBeginning.length)
  expect(blogsAtEnd).not.toContain('Updated title')
  expect(blogsAtEnd).not.toContain('Updated author')
  expect(blogsAtEnd).not.toContain('Updated url')

  const response = await api.get('/api/blogs')
  const likes = response.body.map(x => x.likes)
  expect(likes).not.toContain(5000)

})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'initialTestUser', passwordHash: passwordHash })

    await user.save()
  })

  test('user can be created with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roller',
      name: 'Rolle Järvinen',
      password: 'joku helppo'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user with same username cannot be created', async () => {
    const userWithTakenUsername = {
      username: 'initialTestUser',
      name: 'Ronja Virtanen',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(userWithTakenUsername)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map(u => u.name)

    expect(result.body.error).toContain('Error, expected `username` to be unique')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Ronja Virtanen')
  })

  test('user with username length of 2 characters cannot be created', async () => {
    const newUser = {
      username: 'Bo',
      name: 'Bo Henriksson',
      password: 'hemlighet'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map(u => u.name)

    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Bo Henriksson')

  })

  test('user without username cannot be created', async () => {
    const newUser = {
      name: 'Silvia Larsson',
      password: 'hemlig'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map(u => u.name)

    expect(result.body.error).toContain('User validation failed: username: Path `username` is required')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Silvia Larsson')

  })

  test('user without password cannot be created', async () => {
    const newUser = {
      username: 'lars85',
      name: 'Sven Larsson'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map(u => u.name)

    expect(result.body.error).toContain('password is required')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Sven Larsson')

  })

  test('user with password length of 2 characters cannot be created', async () => {
    const newUser = {
      username: 'failing',
      name: 'Silja Kallio',
      password: 'no'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map(u => u.name)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Silja Kallio')

  })
})
describe('when there are initially three users at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'initialTestUserFirst', passwordHash: passwordHash })

    const passwordHash2 = await bcrypt.hash('password', 10)
    const user2 = new User({ username: 'initialTestUserSecond', passwordHash: passwordHash2 })

    const passwordHash3 = await bcrypt.hash('some secret', 10)
    const user3 = new User({ username: 'initialTestUserThird', passwordHash: passwordHash3 })

    await User.insertMany([user, user2, user3])

  })
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all three users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(3)
  })
})

afterAll(() => {
  mongoose.connection.close()
})