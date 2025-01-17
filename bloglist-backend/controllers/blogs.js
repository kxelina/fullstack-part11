const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  })

  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user not authorized' })
  }

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user : user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!user) {
    return response.status(401).json({ error: 'user not authorized' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'you can only delete ur own blog' }) 
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    {title: body.title, author: body.author, url: body.url, likes: body.likes},
    {new: true, runValidators: true, context: 'query'}
  )
  if (updatedBlog) {
    response.json(updatedBlog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    blog.comments = blog.comments.concat(comment)
    await blog.save()
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
  