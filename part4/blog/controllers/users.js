const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_request, response) => {
  const users = await User
    .find({})
    // .populate('blogs', { title: 1, author: 1, url: 1, likes: 1})

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password )
    response.status(400).send({ error: 'missing essential user data' })
  else if ( username.length < 3 || password.length < 3)
    response.status(400).send({ error: 'invalid username or password' })
  else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const stringName = name || ''

    const user = new User({
      username: username,
      name: stringName,
      passwordHash: passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

// usersRouter.get('/:id', (request, response, next) => {
//   Blog.findById(request.params.id)
//     .then(blog => {
//       if (blog) {
//         response.json(blog)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// usersRouter.delete('/:id', async (request, response) => {
//   await User.findByIdAndDelete(request.params.id)
//   response.status(204).end()
// })

// usersRouter.put('/:id', async (request, response) => {
//   const body = request.body

//   const user = {
//     title: body.content,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   }

//   if (!user.likes)
//     response.status(400).send({ error: 'missing likes' })
//   else if (isNaN(user.likes))
//     response.status(400).send({ error: 'wrong field value for likes ' })
//   else {
//     const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
//     if (updatedUser) {
//       response.json(updatedUser)
//     } else {
//       response.status(404).end()
//     }
//   }
// })

module.exports = usersRouter