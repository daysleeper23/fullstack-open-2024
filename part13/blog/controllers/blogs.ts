const express = require('express');
import { Request, Response } from 'express';
const { Blog } = require('../model');

const router = express.Router();

const getAllBlogs = async (_req: Request, res: Response) => {
  const blogs = await Blog.findAll({ raw: true });
  res.json(blogs);
};

const createBlog = async (req: Request, res: Response) => {
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
};

const getBlogById = (req: Request, res: Response) => {
  res.send(`Get blog with ID ${req.params.id}`);
};

const updateBlog = async (req: Request, res: Response) => {
  //get the id of the blog to be updated
  const id = Number(req.params.id);

  //find the blog with the id using sequelize
  const blog = await Blog.findByPk(id);
  console.log(blog);

  //if the blog is not found, return a 404 status code
  if (!blog) {
    res.status(404).end();
  
  //if the blog is found, update the likes of the blog using sequelize
  } else {
    try {
      blog.likes = req.body.likes;
      await blog.save();
      res.json(blog);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      } else {
        res.status(400).send('An unknown error occurred');
      }
    }
  }
};

const deleteBlog = async (req: Request, res: Response) => {
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
};

// Define routes
router.get('/', getAllBlogs);
router.post('/', createBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;