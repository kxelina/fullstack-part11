const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

let token 

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    token = await helper.createUser()
    const user = await User.findOne({ username: 'test' })
    const blogs = helper.initialBlogs.map(blog => ({ ...blog, user: user._id }))
    await Blog.insertMany(blogs)
})

test.only('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
  
test.only('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('all blogs should have id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
        assert.strictEqual(blog._id, undefined)
        assert.ok(blog.id)
        })
})

test.only('a valid blog can be added', async () => {
    const newBlog = helper.newBlog

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    const titles = response.body.map(r => r.title)
    assert(titles.includes(newBlog.title))
})

test.only('if no given likes, then its 0', async () => {
    const newBlog = helper.noLikes

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
})

test.only('if no given title or url, then it give bad request 400', async () => {
    const newBlog = helper.noTitle

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    const newBlog2 = helper.noUrl

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog2)
        .expect(400)
})


test.only('if deleted then returns 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const title = blogsAtEnd.map(r => r.title)
    assert(!title.includes(blogToDelete.title))
})

test.only('blogs are updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = helper.updatedBlog
  
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.title, updatedBlog.title)
    assert.strictEqual(response.body.author, updatedBlog.author)
    assert.strictEqual(response.body.url, updatedBlog.url)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
})

test.only('if no token with blog then returns 401', async () => {
    const newBlog = helper.newBlog

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

  

after(async () => {
  await mongoose.connection.close()
})