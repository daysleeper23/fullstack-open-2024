import request from 'supertest';
import app from '../app';
const { User, Blog, ReadingList } = require('../models');
const { sequelize } = require('../util/db') ;


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

let authToken = '';
let testUserId = 0;
let readingListId = 0;
let readingListId2 = 0;
let theBlogId = 0;
let theBlogId2 = 0;

describe('Users API', () => {

  beforeAll(async () => {
    // await sequelize.sync({ force: true, logging: console.log });
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    //clear data in User table
    await User.destroy({ where: {} });
    await Blog.destroy({ where: {} });
    await ReadingList.destroy({ where: {} });

    await User.create({ username: 'itestuser@test.com', name: 'Integration Test User' });
  
    //login & retrieve auth token
    let response = await request(app)
      .post('/api/login')
      .send({ username: 'itestuser@test.com', password: 'password' });
    
    let token = response.body.token;
    authToken = `Bearer ${token}`;
  
    //store user id
    const user = await User.findOne({ });
    testUserId = user.id;
  
    //initialize blogs
    for (const blog of initialBlogs) {
      await request(app)
        .post('/api/blogs')
        .send(
          {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes,
            user_id: user.id
          })
        .set('Authorization', authToken)
        .expect(200);
    };

    //add a blog to reading list
    let blog = await Blog.findOne({
      where: { 
        author: 'Michael Chan' 
      } 
    });
    theBlogId = blog.id;

    let readingList = {
      blogId: theBlogId,
      userId: testUserId
    }

    response = await request(app)
      .post('/api/readinglists')
      .set('Authorization', authToken)
      .send(readingList)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    readingListId = response.body.id;

    //add another blog to the reading list of testUserId
    blog = await Blog.findOne({
      where: { 
        title: 'TDD harms architecture' 
      } 
    });
    theBlogId2 = blog.id;
    readingList.blogId = theBlogId2;

    response = await request(app)
      .post('/api/readinglists')
      .set('Authorization', authToken)
      .send(readingList)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    readingListId2 = response.body.id;
  });

  afterAll(async () => {    
    // Close the database connection after tests
    await sequelize.close();
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        username: 'testuser@test.com',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.username).toBe(newUser.username);
      expect(response.body.name).toBe(newUser.name);

      const user = await User.findByPk(response.body.id);
      expect(user).not.toBeNull();
      expect(user!.username).toBe(newUser.username);
      expect(user!.name).toBe(newUser.name);
    });

    it('should return 400 if missing name', async () => {
      const newUser = {
        username: 'testuser@test.com'
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });

    it('should return 400 if missing username', async () => {
      const newUser = {
        name: 'Test User'
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });

    it('should return 400 if username is not a string', async () => {
      const newUser = {
        username: 123,
        name: 'Test User'
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });

    it('should return 400 if name is not a string', async () => {
      const newUser = {
        username: 'testuser@test.com',
        name: 123
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });

    it('should return 400 if username is not unique', async () => {
      const newUser = {
        username: 'testuser2@test.com',
        name: 'Test User 2'
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });
  });

  describe('PUT /api/users/:username', () => {
    it('should update a user with valid data', async () => {
      const newUser = {
        username: 'testuser3@test.com',
        name: 'Test User 3'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      const updatedUser = {
        username: 'testuser4@test.com'
      };

      const updatedResponse = await request(app)
        .put(`/api/users/${response.body.username}`)
        .send(updatedUser)
        .expect(200);

      expect(updatedResponse.body.username).toBe(updatedUser.username);

      const user = await User.findByPk(response.body.id);
      expect(user).not.toBeNull();
      expect(user!.username).toBe(updatedUser.username);
      expect(user!.name).toBe(newUser.name);
    });

    it('should return 400 if username is not a string', async () => {
      const newUser = {
        username: 'testuser5@test.com',
        name: 'Test User 5'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      const updatedUser = {
        username: 123
      };

      await request(app)
        .put(`/api/users/${response.body.username}`)
        .send(updatedUser)
        .expect(400);
    });

    it('should return 400 if username is not found', async () => {
      const updatedUser = {
        username: 'testuser6@test.com'
      };

      await request(app)
        .put(`/api/users/testuser6@test.com`)
        .send(updatedUser)
        .expect(404);
    });

    it('should return 400 if username is not provided', async () => {
      const newUser = {
        username: 'testuser7@test.com',
        name: 'Test User 7'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      await request(app)
        .put(`/api/users/${response.body.username}`)
        .expect(400);
    });

    it('should return 400 if username is not unique', async () => {
      const newUser = {
        username: 'testuser8@test.com',
        name: 'Test User 8'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      const newUser2 = {
        username: 'testuser9@test.com',
        name: 'Test User 9'
      };

      await request(app)
        .post('/api/users')
        .send(newUser2)
        .expect(200);

      const updatedUser = {
        username: 'testuser9@test.com'
      };

      await request(app)
        .put(`/api/users/${response.body.username}`)
        .send(updatedUser)
        .expect(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user data', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}`)
        .expect(200);

      expect(response.body.id).toBe(testUserId);
      expect(response.body.username).toBe('itestuser@test.com');
      expect(response.body.name).toBe('Integration Test User');
      expect(response.body.readings.length).toBe(2);
      expect(response.body.readings[0].id).toBe(theBlogId);
      expect(response.body.readings[1].id).toBe(theBlogId2);
      expect(response.body.readings[0].readingList.id).toBe(readingListId);
      expect(response.body.readings[1].readingList.id).toBe(readingListId2);
      expect(response.body.readings[0].readingList.read).toBe(false);
      expect(response.body.readings[1].readingList.read).toBe(false);
    });

    it('should return the unread blog (theBlogId) if the query param is false', async () => {
      const response = await request(app)
        .get(`/api/users/${testUserId}?read=false`)
        .expect(200);

      expect(response.body.id).toBe(testUserId);
      expect(response.body.username).toBe('itestuser@test.com');
      expect(response.body.name).toBe('Integration Test User');
      expect(response.body.readings.length).toBe(2);
      expect(response.body.readings[0].id).toBe(theBlogId);
      expect(response.body.readings[0].readingList.id).toBe(readingListId);
      expect(response.body.readings[0].readingList.read).toBe(false);
      expect(response.body.readings[1].id).toBe(theBlogId2);
      expect(response.body.readings[1].readingList.id).toBe(readingListId2);
      expect(response.body.readings[1].readingList.read).toBe(false);
    })

    it('should return the read blog (theBlogId2) if the query param is false', async () => {
      //mark the 2nd blog as read
      await request(app)
        .put(`/api/readinglists/${readingListId2}`)
        .set('Authorization', authToken)
        .send({ read: true })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const response = await request(app)
        .get(`/api/users/${testUserId}?read=true`)
        .expect(200);

      expect(response.body.id).toBe(testUserId);
      expect(response.body.username).toBe('itestuser@test.com');
      expect(response.body.name).toBe('Integration Test User');
      expect(response.body.readings.length).toBe(1);
      expect(response.body.readings[0].id).toBe(theBlogId2);
      expect(response.body.readings[0].readingList.id).toBe(readingListId2);
      expect(response.body.readings[0].readingList.read).toBe(true);
    })
  });
});