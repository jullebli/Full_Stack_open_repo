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

afterAll(() => {
  mongoose.connection.close()
})