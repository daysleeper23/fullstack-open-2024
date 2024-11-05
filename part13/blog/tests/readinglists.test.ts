import request from 'supertest';
import app from '../app';

const { Blog, User, ReadingList } = require ('../models');
const { sequelize } = require('../util/db');

let authToken = '';
let testUserId = 0;
// let blogId = 0;
let readingListId = 0;

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fe',
    title: 'Type wars II',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html',
    likes: 2,
    __v: 0
  }
]


describe('Reading Lists API', () => {
  beforeAll(async () => {
    // await sequelize.sync({ force: true, logging: console.log });
    await sequelize.sync({ force: true });
  });
  
  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await Blog.destroy({ where: {} });
    await User.destroy({ where: {} });
    await ReadingList.destroy({ where: {} });
  
    await User.create({ username: 'itestuser@test.com', name: 'Integration Test User' });
  
    let response = await request(app)
      .post('/api/login')
      .send({ username: 'itestuser@test.com', password: 'password' });
    
    let token = response.body.token;
    authToken = `Bearer ${token}`;
  
    const user = await User.findOne({ });
    testUserId = user.id;
  
    initialBlogs.forEach(async blog => {
      try{
        await Blog.create({
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes,
          user_id: user.id
        });
      }
      catch (error){
        console.log('error: ', error);
      }
      
    });
  });

  describe('POST /api/readinglists', () => {
    it('should add a blog to the user reading list', async () => {
      const blog = await Blog.findOne({ where: { title: 'React patterns' } });
      const readingList = {
        blogId: blog.id,
        userId: testUserId
      }

      const response = await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.blogId).toBe(blog.id);
      expect(response.body.userId).toBe(testUserId);
      expect(response.body.read).toBe(false);
    });

    it('should not add a blog to the user reading list if it already exists', async () => {
      const blog = await Blog.findOne({ where: { title: 'React patterns' } });
      const readingList = {
        blogId: blog.id,
        userId: testUserId
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(200);

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(400);
    });

    it('should return 400 if blog id is missing', async () => {
      const readingList = {
        userId: testUserId
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(400);
    });

    it('should return 400 if user id is missing', async () => {
      const blog = await Blog.findOne({ where: { title: 'React patterns' } });
      const readingList = {
        blogId: blog.id
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(400);
    });

    it('should return 400 if blog id is not a number', async () => {
      const readingList = {
        blogId: 'test',
        userId: testUserId
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(400);
    });

    it('should return 400 if user id is not a number', async () => {
      const blog = await Blog.findOne({ where: { title: 'React patterns' } });
      const readingList = {
        blogId: blog.id,
        userId: 'test'
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(400);
    });

    it('should return 404 if blog not found', async () => {
      const readingList = {
        blogId: 100,
        userId: testUserId
      }

      await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(404);
    });
  });

  describe('PUT /api/readinglists/:id', () => {
    
    beforeEach(async () => {
      await ReadingList.destroy({ where: {} });

      const blog = await Blog.findOne({ where: { title: 'React patterns' } });
      const readingList = {
        blogId: blog.id,
        userId: testUserId
      }

      const response = await request(app)
        .post('/api/readinglists')
        .set('Authorization', authToken)
        .send(readingList)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      readingListId = response.body.id;
    });

    it('should update a blog in the user reading list', async () => {
      const updatedReadingList = { 
        read: true 
      };

      const response = await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .set('Authorization', authToken)
        .send(updatedReadingList)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      
      expect(response.body.read).toBe(true);
    });

    it('should return 400 if read is missing', async () => {
      const updatedReadingList = { red: true };

      await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .set('Authorization', authToken)
        .send(updatedReadingList)
        .expect(400);
    });

    it('should return 400 if read is not a boolean', async () => {
      const updatedReadingList = { read: 'true' };

      await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .set('Authorization', authToken)
        .send(updatedReadingList)
        .expect(400);
    });

    it('should return 400 if read is not true', async () => {
      const updatedReadingList = { read: false };

      await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .set('Authorization', authToken)
        .send(updatedReadingList)
        .expect(400);
    });

    it('should return 401 if token is missing', async () => {
      const updatedReadingList = { read: true };

      await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .send(updatedReadingList)
        .expect(401);
    });

    it('should return 401 if token is invalid', async () => {
      const updatedReadingList = { read: true };

      await request(app)
        .put(`/api/readinglists/${readingListId}`)
        .set('Authorization', 'Bearer invalid')
        .send(updatedReadingList)
        .expect(401);
    });

    it('should return 404 if reading list not found', async () => {
      const updatedReadingList = { read: true };

      await request(app)
        .put('/api/readinglists/100')
        .set('Authorization', authToken)
        .send(updatedReadingList)
        .expect(404);
    });
  });
});