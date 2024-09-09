const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { response } = require('express')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fe",
    title: "Type wars II",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(promiseArray)
  
  // let blogObject = new Blog(initialBlogs[0])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[1])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[2])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[3])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[4])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[5])
  // await blogObject.save()
  // blogObject = new Blog(initialBlogs[6])
  // await blogObject.save()
})

describe('blog inquiry', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')  
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        const blog = response.body[0]
        if (!blog.id) throw new Error('id property is missing');
        if (blog._id) throw new Error('_id property should not be presented');
      })
  })
  
  test('there are seven blog', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
  
  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(e => e.title)
    assert.strictEqual(titles.includes('React patterns'), true)
  })
})

describe('blog deletion', () => {
  test('valid blog is deleted normally', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)

    //note is deleted
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, initialBlogs.length - 1)
    assert.strictEqual(titles.includes('React patterns'), false)
  })

  test('invalid blog id is not deleted', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d1700')
      .expect(204)

    //note is deleted
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('missing blog id results in 404', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/')
      .expect(404)

    //note is deleted
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('blog creation', () => {
  test('missing title', async () => {
    const newBlog = {
      author: "Charles Darwin",
      url: "https",
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('missing url', async () => {
    const newBlog = {
      title: "Evolution",
      author: "Charles Darwin",
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('missing both title & url', async () => {
    const newBlog = {
      author: "Charles Darwin",
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('valid blog is created normally', async () => {
    const newBlog = {
      title: "No Home",
      author: "Charles Dickens",
      url: "https",
      likes: 5
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new note is added
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('No Home'))
  })

  test('default like is 0', async () => {
    const newBlog = {
      title: "Evolution",
      author: "Charles Darwin",
      url: "https"
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new blog's like is 0
    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    const newIndex = response.body.findIndex(blog => blog.title == "Evolution")
    assert.strictEqual(likes[newIndex], 0)
    assert.strictEqual(response.body[newIndex].title, 'Evolution')
  })
})


after(async () => {
  await mongoose.connection.close()
})