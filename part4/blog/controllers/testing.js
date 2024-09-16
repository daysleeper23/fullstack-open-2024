const Blog = require('../models/blog')
const User = require('../models/user')
const testingRouter = require('express').Router()

testingRouter.post('/reset', async (_request, _response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

testingRouter.post('/create/:username', async (request, response) => {
  const blog = await new Blog(request.body)
  let user = await User.findOne({ username: request.params.username })
  if (user)
    blog.user = user.id
  else {
    console.log('start creating fake user')

    user = new User({
      username: 'fake',
      name: 'Fake'
    })
    await user.save()
    blog.user = User.findOne({ username: 'fake' }).id
    console.log('fake id', blog.user)
    await User.findOneAndDelete({ username: 'fake' })
  }

  if (!blog.likes)
    blog.likes = 0

  await blog.save()

  response.status(201).end()
})

module.exports = testingRouter