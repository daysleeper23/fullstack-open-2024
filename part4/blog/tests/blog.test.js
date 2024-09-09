const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const helper = require('../utils/test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(promiseArray)
})

describe('blog inquiry', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((response) => {
        const blog = response.body[0]
        if (!blog.id) throw new Error('id property is missing')
        if (blog._id) throw new Error('_id property should not be presented')
      })
  })

  test('there are seven blog', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

    //blog is deleted
    const blogsAfter = await helper.blogsInDb()
    const titles = blogsAfter.map(r => r.title)
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1)
    assert.strictEqual(titles.includes('React patterns'), false)
  })

  test('non-existent blog is not deleted', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d1700')
      .expect(204)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('invalid blog id format results in 400 Bad Request', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d17')
      .expect(400)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('missing blog id results in 400', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/')
      .expect(400)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })
})

describe('blog update', () => {
  test('valid blog is updated normally', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
    }

    //return code and content-type
    await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(updatingBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //the right blog is updated
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.id === '5a422a851b54a676234d17f7')
    const likes = blogsAfter.map(blog => blog.likes)
    assert.strictEqual(likes[index], 17)
  })

  test('non-existent blog results in initial blogs remained unchanged', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
    }

    //return code and content-type
    const fakeId = await helper.nonExistingId()
    await api
      .put(`/api/blogs/${fakeId}`)
      .send(updatingBlog)
      .expect(404)

    //the initial blog list is not updated as the id was invalid
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.title === 'React patterns')
    assert.strictEqual(blogsAfter[index].likes, 7)
  })

  test('invalid blog id format results in 400 Bad Request', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 17,
    }

    //return code and content-type
    await api
      .put('/api/blogs/123')
      .send(updatingBlog)
      .expect(400)

    //the likes of the updating blog remained unchanged
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.title === 'React patterns')
    assert.strictEqual(blogsAfter[index].likes, 7)
  })

  test('missing likes results in 400 Bad Request', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/'
    }

    //return code and content-type
    await api
      .put('/api/blogs/5a422a851b54a676234d17')
      .send(updatingBlog)
      .expect(400)

    //the likes of the updating blog remained unchanged
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.title === 'React patterns')
    assert.strictEqual(blogsAfter[index].likes, 7)
  })

  test('string values (number-like) for likes results in 400 Bad Request', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: '17'
    }

    //return code and content-type
    await api
      .put('/api/blogs/5a422a851b54a676234d17')
      .send(updatingBlog)
      .expect(400)

    //the likes of the updating blog remained unchanged
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.title === 'React patterns')
    assert.strictEqual(blogsAfter[index].likes, 7)
  })

  test('object values for likes results in 400 Bad Request', async () => {
    const updatingBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: { likes: '17' }
    }

    //return code and content-type
    await api
      .put('/api/blogs/5a422a851b54a676234d17')
      .send(updatingBlog)
      .expect(400)

    //the likes of the updating blog remained unchanged
    const blogsAfter = await helper.blogsInDb()
    const index = blogsAfter.findIndex(blog => blog.title === 'React patterns')
    assert.strictEqual(blogsAfter[index].likes, 7)
  })
})

describe('blog creation', () => {
  test('missing title', async () => {
    const newBlog = {
      author: 'Charles Darwin',
      url: 'https',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('missing url', async () => {
    const newBlog = {
      title: 'Evolution',
      author: 'Charles Darwin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('missing both title & url', async () => {
    const newBlog = {
      author: 'Charles Darwin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('valid blog is created normally', async () => {
    const newBlog = {
      title: 'No Home',
      author: 'Charles Dickens',
      url: 'https',
      likes: 5
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new blog is added
    const blogsAfter = await helper.blogsInDb()
    const titles = blogsAfter.map(r => r.title)
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
    assert(titles.includes('No Home'))
  })

  test('default like is 0', async () => {
    const newBlog = {
      title: 'Evolution',
      author: 'Charles Darwin',
      url: 'https'
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new blog's like is 0
    const blogsAfter = await helper.blogsInDb()
    const likes = blogsAfter.map(r => r.likes)
    const newIndex = blogsAfter.findIndex(blog => blog.title === 'Evolution')
    assert.strictEqual(likes[newIndex], 0)
    assert.strictEqual(blogsAfter[newIndex].title, 'Evolution')
  })
})


after(async () => {
  await mongoose.connection.close()
})