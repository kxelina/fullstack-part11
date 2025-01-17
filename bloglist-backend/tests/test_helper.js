const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
      title: "first",
      author: "blogger",
      url: "http://first",
      likes: 1
  },
  {
      title: "second",
      author: "blogger",
      url: "http://second",
      likes: 2
  },
  ]

const initialUsers = [
  {
      username: "first",
      name: "user1",
      passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36TQYekz"
  },
  {
      username: "second",
      name: "user2",
      passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaW2jjiis763oio"
  },
]

const shortPw = {
  username: 'new',
  name: 'new',
  password: 'pw'
}

const noPw = {
  username: 'new2',
  name: 'new2'
}

const noUsername = {
  name: 'new',
  password: 'new'
}

const newBlog = {
  title: 'moimoi',
  author: 'moikka',
  url: 'http://moimoi',
  likes: 1
}

const newUser = {
  username: 'mluukkai',
  name: 'Matti Luukkainen',
  password: 'salainen',
}

const noLikes = { title: 'no',
  author: "no",
  url: "no" }

const noTitle = { author: "no", url: "no" }

const noUrl = { title: "no", author: "no"}

const updatedBlog = {
  title: 'update',
  author: 'update',
  url: 'update',
  likes: 100
  }

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const createUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'test', name: 'Test', passwordHash })

  await user.save()

  const userToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userToken, process.env.SECRET)
}
  
module.exports = {
initialBlogs, newBlog, 
noPw, noLikes, noTitle, 
noUrl, blogsInDb, updatedBlog, 
initialUsers, shortPw, noUsername, 
usersInDb, newUser, createUser
}