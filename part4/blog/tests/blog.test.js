const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
const helper = require('../utils/test_helper')
let token = ''

const blogsInit = async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(promiseArray)
}

const userInit = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
}

const authInit = async () => {
  const user = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(user)

  token = 'Bearer ' + response.body.token
}

beforeEach(async () => {
  await blogsInit()
  await userInit()
  await authInit()
})

describe('querying blogs', () => {
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

describe('deleting a blog', () => {
  test('with valid ID is OK', async () => {

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

  test('with a non-existent ID is OK but nothing changed', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d1700')
      .expect(204)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('with invalid blog ID format results in 400 Bad Request', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/5a422a851b54a676234d17')
      .expect(400)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('without blog ID results in 400 Bad Request', async () => {

    //return code and content-type
    await api
      .delete('/api/blogs/')
      .expect(400)

    //blog is not deleted
    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })
})

describe('updating a blog', () => {
  test('with valid information is OK', async () => {
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

  test('using non-existent ID results in 404 Not Found', async () => {
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

  test('using invalid blog ID format results in 400 Bad Request', async () => {
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

  test('but missing likes results in 400 Bad Request', async () => {
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

  test('using string values (number-like) for likes results in 400 Bad Request', async () => {
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

  test('using object values for likes results in 400 Bad Request', async () => {
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

describe('creating a blog', () => {
  test('when missing title is not possible', async () => {
    const newBlog = {
      author: 'Charles Darwin',
      url: 'https',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      // .set('user', rootUser)
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('when missing url is not possible', async () => {
    const newBlog = {
      title: 'Evolution',
      author: 'Charles Darwin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      // .set('user', rootUser)
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('when missing both title & url is not possible', async () => {
    const newBlog = {
      author: 'Charles Darwin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      // .set('user', rootUser)
      .send(newBlog)
      .expect(400)

    const blogsAfter = await helper.blogsInDb()
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
  })

  test('when missing authorization token is not possible', async () => {
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
      .expect(401)
      .expect('Content-Type', /application\/json/)

    //new blog is not added
    const blogsAfter = await helper.blogsInDb()
    const titles = blogsAfter.map(r => r.title)
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length)
    assert.strictEqual(titles.includes('No Home'), false)
  })

  test('with valid information is OK', async () => {
    const newBlog = {
      title: 'No Home',
      author: 'Charles Dickens',
      url: 'https',
      likes: 5
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      // .set('user', rootUser)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new blog is added
    const blogsAfter = await helper.blogsInDb()
    const titles = blogsAfter.map(r => r.title)
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
    assert(titles.includes('No Home'))
  })

  test('without like value is OK but then default like is 0', async () => {
    const newBlog = {
      title: 'Evolution',
      author: 'Charles Darwin',
      url: 'https'
    }

    //return code and content-type
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //new blog's like is 0
    const blogsAfter = await helper.blogsInDb()
    const likes = blogsAfter.map(r => r.likes)
    const newIndex = blogsAfter.findIndex(blog => blog.title === 'Evolution')
    assert.strictEqual(likes[newIndex], 0)
    assert.strictEqual(blogsAfter[newIndex].title, 'Evolution')
    assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
  })
})


after(async () => {
  await mongoose.connection.close()
})