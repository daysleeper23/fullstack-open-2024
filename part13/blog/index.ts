require('dotenv').config();
const { Model, Sequelize, DataTypes } = require('sequelize');
const express = require('express');
import { Request, Response } from 'express';
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

//config baseUrl for the server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const baseUrl = '/api/blogs';

//GET request to the root of the server
app.get(`${baseUrl}`, async (_req: Request, res: Response) => {
  const blogs = await Blog.findAll({ raw: true });
  res.json(blogs);
});

//POST request to the root of the server
app.post(`${baseUrl}`, async (req: Request, res: Response) => {
  //read the body of the request
  const body = req.body;

  //create a new blog object with the body of the request using sequelize
  const blog = Blog.build(body);

  //save the blog object to the database using try-catch block
  try {
    await blog.save();
    res.json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send('An unknown error occurred');
    }
  }
});

//DELETE request to the root of the server
app.delete(`${baseUrl}/:id`, async (req: Request, res: Response) => {
  //get the id of the blog to be deleted
  const id = Number(req.params.id);

  //delete the blog with the id using sequelize using try-catch block
  try {
    await Blog.destroy({
      where: {
        id: id
      }
    });
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    } else {
      res.status(400).send('An unknown error occurred');
    }
  }
});

//initialize express server with a env variable PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});