const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
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
  const blogsAtBeginning = await (await helper.blogsInDb()).length

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
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning + 1)
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

afterAll(() => {
  mongoose.connection.close()
})
