import request from 'supertest';
// const app = require('../app');
import app from '../app';
const { Blog, User } = require ('../models');
const { sequelize } = require('../util/db');

let authToken = '';
let authToken2 = '';

beforeEach(async () => {
  await Blog.destroy({ where: {} });
  await User.destroy({ where: {} });

  await User.create({ username: 'itestuser@test.com', name: 'Integration Test User' });

  let response = await request(app)
    .post('/api/login')
    .send({ username: 'itestuser@test.com', password: 'password' });
  
  let token = response.body.token;
  authToken = `Bearer ${token}`;

  await User.create({ username: 'itestuser2@test.com', name: 'Integration Test User 2' });

  response = await request(app)
    .post('/api/login')
    .send({ username: 'itestuser2@test.com', password: 'password' });
  
  token = response.body.token;
  authToken2 = `Bearer ${token}`;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Blogs API', () => {
  describe('POST /api/blogs', () => {
    it('should create a new blog with valid data', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.title).toBe(newBlog.title);
      expect(response.body.author).toBe(newBlog.author);
      expect(response.body.url).toBe(newBlog.url);
      expect(response.body.likes).toBe(newBlog.likes);
      expect(response.body.id).toBeDefined();
    });

    it('should create a new blog with default likes', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com'
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.likes).toBe(0);
    });

    it('should return 400 if missing title', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'http://test.com'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if missing url', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if title is not a string', async () => {
      const newBlog = {
        title: 123,
        author: 'Test Author',
        url: 'http://test.com'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if url is not a string', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 123
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if url is not a valid URL', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'test'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if author is not a string', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 123,
        url: 'http://test.com'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);

    });

    it('should return 400 if likes is not a number', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 'abc'
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });

    it('should return 400 if likes is negative', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: -1
      };

      await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog)
        .expect(400);
    });
  });

  describe('PUT /api/blogs', () => {

    let originalBlog = {
      id: 0,
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 10
    };

    beforeEach(async () => {
      await Blog.destroy({ where: {} });

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10
      };
      
      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog);

      originalBlog.id = Number(response.body.id);
    });

    it('should update the likes of a blog', async () => {
      const updatedBlog = {
        likes: 20
      };

      const updatedResponse = await request(app)
        .put(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', authToken)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(updatedResponse.body.likes).toBe(updatedBlog.likes);
    });

    it('should return 400 if likes is not a number', async () => {
      const updatedBlog = {
        likes: 'abc'
      };

      await request(app)
        .put(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', authToken)
        .send(updatedBlog)
        .expect(400);
    });

    it('should return 400 if likes is negative', async () => {
      const updatedBlog = {
        likes: -1
      };

      await request(app)
        .put(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', authToken)
        .send(updatedBlog)
        .expect(400);
    });

    it('should return 404 if blog not found', async () => {
      const updatedBlog = {
        likes: 20
      };

      await request(app)
        .put('/api/blogs/123')
        .set('Authorization', authToken)
        .send(updatedBlog)
        .expect(404);
    });
  });

  describe('DELETE /api/blogs', () => {
    let originalBlog = {
      id: 0,
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 10
    };

    beforeEach(async () => {
      await Blog.destroy({ where: {} });

      const newBlog = {
        title: originalBlog.title,
        author: originalBlog.author,
        url: originalBlog.url,
        likes: originalBlog.likes
      };

      const response = await request(app)
        .post('/api/blogs')
        .set('Authorization', authToken)
        .send(newBlog);

      originalBlog.id = Number(response.body.id);
    });

    it('should delete a blog', async () => {
      await request(app)
        .delete(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', authToken)
        .expect(204);

      const blog = await Blog.findByPk(originalBlog.id);
      expect(blog).toBeNull();
    });

    it('should return 404 if blog not found', async () => {
      await request(app)
        .delete('/api/blogs/123')
        .set('Authorization', authToken)
        .expect(404);
    });

    it('should return 401 if token is missing', async () => {
      await request(app)
        .delete(`/api/blogs/${originalBlog.id}`)
        .expect(401);
    });

    it('should return 401 if token is invalid', async () => {
      await request(app)
        .delete(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });

    it('should return 401 if token is for another user', async () => {
      await request(app)
        .delete(`/api/blogs/${originalBlog.id}`)
        .set('Authorization', authToken2)
        .expect(401);
    });

    it('should return 400 if blog id is not a number', async () => {
      await request(app)
        .delete('/api/blogs/abc')
        .set('Authorization', authToken)
        .expect(400);
    });

    it('should return 400 if blog id is missing', async () => {
      await request(app)
        .delete('/api/blogs/')
        .set('Authorization', authToken)
        .expect(404);
    });
  });
});