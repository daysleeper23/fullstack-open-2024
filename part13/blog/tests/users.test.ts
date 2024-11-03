import request from 'supertest';
import app from '../app';
const { User } = require('../models'); // import your Blog model here
const { sequelize } = require('../util/db') ; // import your Sequelize instance here

describe('Users API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    
    // Delete all data from the database
    await User.destroy({ where: {} });

    // Close the database connection after tests
    await sequelize.close();
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        username: 'testuser',
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
        username: 'testuser'
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
        username: 'testuser',
        name: 123
      };

      await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(400);
    });

    it('should return 400 if username is not unique', async () => {
      const newUser = {
        username: 'testuser2',
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
        username: 'testuser3',
        name: 'Test User 3'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      const updatedUser = {
        username: 'testuser4'
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
        username: 'testuser5',
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
        username: 'testuser6'
      };

      await request(app)
        .put(`/api/users/testuser6`)
        .send(updatedUser)
        .expect(404);
    });

    it('should return 400 if username is not provided', async () => {
      const newUser = {
        username: 'testuser7',
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
        username: 'testuser8',
        name: 'Test User 8'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      const newUser2 = {
        username: 'testuser9',
        name: 'Test User 9'
      };

      await request(app)
        .post('/api/users')
        .send(newUser2)
        .expect(200);

      const updatedUser = {
        username: 'testuser9'
      };

      await request(app)
        .put(`/api/users/${response.body.username}`)
        .send(updatedUser)
        .expect(400);
    });
  });
});