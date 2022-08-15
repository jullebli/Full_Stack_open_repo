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

describe('(Even) without authorization token', () => {
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

  test('deleting returns code 401 and none is deleted', async () => {
    const blogsAtBeginning = await helper.blogsInDb()
    const someBlog = await Blog.findOne({})

    await api.delete(`/api/blogs/${someBlog.id}`).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length)
  })
})

describe('Given correct authorization token', () => {
  let authorization

  beforeEach(async () => {
    await User.deleteMany({})

    const testUser = {
      username: 'testerizer',
      name: 'Test user',
      password: 'password',
    }

    await api.post('/api/users').send(testUser)

    const result = await api.post('/api/login').send(testUser)

    authorization = `bearer ${result.body.token}`
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
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((x) => x.title)

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
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
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
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    const authors = response.body.map((x) => x.author)
    const urls = response.body.map((x) => x.url)

    expect(authors).not.toContain('Mysterious coders')
    expect(urls).not.toContain('www.notarealaddress.com')
  })

  test('blog without url and title will not be added', async () => {
    const newBlog = {
      author: 'Mysterious coders',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    const authors = response.body.map((x) => x.author)

    expect(authors).not.toContain('Mysterious coders')
  })

  test('valid id will delete blog from database', async () => {
    const newBlog = {
      title: 'Java for dummies',
      author: 'Mysterious Javas',
      url: 'www.notarealaddress.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsBeforeDeleting = await helper.blogsInDb()
    const toBeDeletedBlog = await Blog.findOne({ title: 'Java for dummies' })
    const toBeDeletedId = toBeDeletedBlog.id

    await api
      .delete(`/api/blogs/${toBeDeletedId}`)
      .set('Authorization', authorization)
      .expect(204)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((x) => x.title)
    const ids = response.body.map((x) => x.id)

    const blogsAfterDeleting = await helper.blogsInDb()
    expect(blogsAfterDeleting).toHaveLength(blogsBeforeDeleting.length - 1)
    expect(titles).not.toContain('Java for dummies')
    expect(ids).not.toContain(toBeDeletedId)
  })

  test('deleting with invalid id returns code 400 and none is deleted', async () => {
    const blogsAtBeginning = await helper.blogsInDb()

    await api
      .delete('/api/blogs/someWeirdId')
      .set('Authorization', authorization)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtBeginning.length)
  })

  test('blog can be updated without token', async () => {
    const blog = await Blog.findOne(helper.initialBlogs[1])
    const toBeUpdatedId = blog.id

    const updatedBlog = {
      title: 'Updated title',
      author: 'Updated author',
      url: 'Updated url',
      likes: blog.likes + 5,
    }

    await api.put(`/api/blogs/${toBeUpdatedId}`).send(updatedBlog).expect(200)

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
      likes: 5000,
    }

    await api.put('/api/blogs/invalidId').send(blog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toEqual(blogsAtBeginning.length)
    expect(blogsAtEnd).not.toContain('Updated title')
    expect(blogsAtEnd).not.toContain('Updated author')
    expect(blogsAtEnd).not.toContain('Updated url')

    const response = await api.get('/api/blogs')
    const likes = response.body.map((x) => x.likes)
    expect(likes).not.toContain(5000)
  })
})

describe('When there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'initialTestUser',
      passwordHash: passwordHash,
    })

    await user.save()
  })

  test('user can be created with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roller',
      name: 'Rolle Järvinen',
      password: 'joku helppo',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('user with same username cannot be created', async () => {
    const userWithTakenUsername = {
      username: 'initialTestUser',
      name: 'Ronja Virtanen',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(userWithTakenUsername)
      .expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map((u) => u.name)

    expect(result.body.error).toContain(
      'Error, expected `username` to be unique'
    )

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Ronja Virtanen')
  })

  test('user with username length of 2 characters cannot be created', async () => {
    const newUser = {
      username: 'Bo',
      name: 'Bo Henriksson',
      password: 'hemlighet',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map((u) => u.name)

    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length (3)'
    )

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Bo Henriksson')
  })

  test('user without username cannot be created', async () => {
    const newUser = {
      name: 'Silvia Larsson',
      password: 'hemlig',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map((u) => u.name)

    expect(result.body.error).toContain(
      'User validation failed: username: Path `username` is required'
    )

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Silvia Larsson')
  })

  test('user without password cannot be created', async () => {
    const newUser = {
      username: 'lars85',
      name: 'Sven Larsson',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map((u) => u.name)

    expect(result.body.error).toContain('password is required')

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Sven Larsson')
  })

  test('user with password length of 2 characters cannot be created', async () => {
    const newUser = {
      username: 'failing',
      name: 'Silja Kallio',
      password: 'no',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    const response = await api.get('/api/users')
    const names = response.body.map((u) => u.name)

    expect(result.body.error).toContain(
      'password must be at least 3 characters long'
    )

    expect(response.body).toHaveLength(1)
    expect(names).not.toContain('Silja Kallio')
  })
})

describe('When there are initially three users at db', () => {
  let userCredentials
  let user2Credentials

  beforeEach(async () => {
    await User.deleteMany({})

    const usernameForUser = 'initialTestUserFirst'
    const passwordForUser = 'sekret'

    const usernameForUser2 = 'initialTestUserSecond'
    const passwordForUser2 = 'password'

    const usernameForUser3 = 'initialTestUserThird'
    const passwordForUser3 = 'some secret'

    const passwordHashForUser = await bcrypt.hash(passwordForUser, 10)
    const user = new User({
      username: usernameForUser,
      passwordHash: passwordHashForUser,
    })
    userCredentials = { username: usernameForUser, password: passwordForUser }

    const passwordHashForUser2 = await bcrypt.hash(passwordForUser2, 10)
    const user2 = new User({
      username: usernameForUser2,
      passwordHash: passwordHashForUser2,
    })
    userCredentials = {
      username: usernameForUser2,
      password: passwordForUser2,
    }

    const passwordHashForUser3 = await bcrypt.hash(passwordForUser3, 10)
    const user3 = new User({
      username: usernameForUser3,
      passwordHash: passwordHashForUser3,
    })

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

  test('a user cannot delete a blog from other user (code 401)', async () => {
    const result = await api.post('/api/login').send(userCredentials)

    const userAuthorization = `bearer ${result.body.token}`

    const newBlog = {
      title: 'C# for dummies',
      author: 'Mysterious Cs',
      url: 'www.notarealaddress.com',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', userAuthorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result2 = await api.post('/api/login').send(user2Credentials)
    const user2Authorization = `bearer ${result2.body.token}`

    const toBeDeletedBlog = await Blog.findOne({ title: 'C# for dummies' })
    const toBeDeletedId = toBeDeletedBlog.id

    await api
      .delete(`/api/blogs/${toBeDeletedId}`)
      .set('Authorization', user2Authorization)
      .expect(401)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((x) => x.title)
    expect(titles).toContain('C# for dummies')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
