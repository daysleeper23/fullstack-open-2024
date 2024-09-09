const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url)
    response.status(400).send({ error: 'missing title or url' })
  else {
    if (!blog.likes)
      blog.likes = 0
  
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

// blogsRouter.get('/:id', (request, response, next) => {
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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// blogsRouter.put('/:id', (request, response, next) => {
//   const body = request.body

//   const blog = {
//     content: body.content,
//     important: body.important,
//   }

//   Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//     .then(updatedBlog => {
//       response.json(updatedBlog)
//     })
//     .catch(error => next(error))
// })

module.exports = blogsRouter