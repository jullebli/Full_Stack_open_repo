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
  const blogsAtBeginning = await (await helper.blogsInDb()).length
  const someBlogInDb = await Blog.findOne(helper.initialBlogs[0])
  const toBeDeletedId = someBlogInDb.id

  await api
    .delete(`/api/blogs/${toBeDeletedId}`)
    .expect(204)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(x => x.title)
  const ids = response.body.map(x => x.id)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtBeginning - 1)
  expect(titles).not.toContain(helper.initialBlogs[0].title)
  expect(ids).not.toContain(toBeDeletedId)

})

afterAll(() => {
  mongoose.connection.close()
})