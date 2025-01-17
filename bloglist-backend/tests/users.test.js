const { test, after, beforeEach } = require('node:test')
const User = require('../models/user')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

test.only('new user is created', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = helper.newUser

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

test.only('error if username is taken', async () => {
  const newUser = {
    username: helper.initialUsers[0].username,
    name: 'duplicate',
    password: 'secret',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.error, 'username must be unique')
})

test.only('error if password is too short or missing', async () => {
  const newUser = helper.shortPw

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.error, 'password is too short')
  const newUser2 = helper.noPw

  const result2 = await api
    .post('/api/users')
    .send(newUser2)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result2.body.error, 'password is missing')
})

test.only('error if username is missing', async () => {
    const newUser = helper.noUsername
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(result.body.error, 'username is missing')
  })

after(async () => {
  await mongoose.connection.close()
})
