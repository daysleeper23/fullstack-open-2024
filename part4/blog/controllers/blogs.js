const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

// ============================================================
// GET ALL: Retrieve all blogs
// ============================================================
blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// ============================================================
// POST COMMENT: Add comments to a blog
// ============================================================
blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const updatingBlog = await Blog.findById(request.params.id)

  if (updatingBlog) {
    let blog = updatingBlog
    // if (blog.comments) {
      blog.comments = updatingBlog.comments.concat({ content: body.content, ts: new Date() })
      console.log('current blog has comments', blog)
    // }
    // else {
    //   // blog.comments = []
    //   console.log('current blog has no comment', blog)
    // }


    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  }
  else {
    response.status(404).end()
  }
})

// ============================================================
// POST: Create a new blog
// ============================================================
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.user = request.user.id

  if (!blog.title || !blog.url)
    response.status(400).send({ error: 'missing title or url' })
  else {
    if (!blog.likes)
      blog.likes = 0

    const savedBlog = await blog.save()

    const user = await User.findById(blog.user)
    user.blogs = user.blogs.concat(savedBlog._id)
    savedBlog.populate('user', { username: 1, name: 1 })
    await user.save()

    response.status(201).json(savedBlog)
  }
})

// ============================================================
// GET: Retrieve a single blog
// ============================================================
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== request.user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized request' })
  }
  else {
    await Blog.findByIdAndDelete(request.params.id)


    response.status(204).end()
  }
})

// ============================================================
// PUT: Update a single blog
// ============================================================
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatingBlog = await Blog.findById(request.params.id)

  if (updatingBlog) {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      user: updatingBlog.user,
      likes: body.likes
    }
  
    if (!blog.likes)
      response.status(400).send({ error: 'missing likes' })
    else if (isNaN(blog.likes))
      response.status(400).send({ error: 'wrong field value for likes ' })
    else {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      if (updatedBlog) {
        response.json(updatedBlog)
      } else {
        response.status(404).end()
      }
    }
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter