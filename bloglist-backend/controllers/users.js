const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
    .find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
  })

  usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs', { url: 1, title: 1, author: 1 })
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  })

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username is missing' })
  }

  if (!password) {
    return response.status(400).json({ error: 'password is missing' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'password is too short' })
  }

  const sameUser = await User.findOne({ username })
  if (sameUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter