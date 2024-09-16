const Blog = require('../models/blog')
const User = require('../models/user')
const testingRouter = require('express').Router()

testingRouter.post('/reset', async (_request, _response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

testingRouter.post('/create', async (request, response) => {
  const blog = await new Blog(request.body)
  const user = await User.findOne({ username: 'root' })
  blog.user = user.id
  blog.likes = 0

  await blog.save()

  response.status(201).end()
})

module.exports = testingRouter