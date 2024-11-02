const express = require('express');
import { createError, updateError } from '../util/middleware';
import { Request, Response } from 'express';
const { Blog } = require('../models');

const router = express.Router();

const getAllBlogs = async (_req: Request, res: Response) => {
  const blogs = await Blog.findAll({ raw: true });
  res.json(blogs);
};

const createBlog = async (req: Request, res: Response) => {
  //read the body of the request
  const body = req.body;

  if (!body.title) {
    throw createError(400, 'Title is required');
  }

  if (!body.url) {
    throw createError(400, 'URL is required');
  }

  if (typeof body.title !== 'string' || typeof body.url !== 'string') {
    throw createError(400, 'Title and URL must be strings');
  }

  const urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
  if (!urlPattern.test(body.url)) {
    throw createError(400, 'URL must be a valid URL');
  }

  if (body.likes !== undefined && (!Number.isInteger(body.likes) || body.likes < 0)) {
    throw createError(400, 'Likes must be a non-negative integer');
  }

  if (body.createdDate && isNaN(new Date(body.createdDate).getTime())) {
    throw createError(400, 'Created Date must be a valid date');
  }

  //create a new blog object with the body of the request using sequelize
  const blog = Blog.build(body);

  //save the blog object to the database using try-catch block
  await blog.save();
  res.json(blog);
};

const getBlogById = (req: Request, res: Response) => {
  res.send(`Get blog with ID ${req.params.id}`);
};

const updateBlog = async (req: Request, res: Response) => {
  //get the id of the blog to be updated
  const id = Number(req.params.id);

  //find the blog with the id using sequelize
  const blog = await Blog.findByPk(id);

  //if the blog is not found, return a 404 status code
  if (!blog) {
    throw updateError(404, 'Blog not found');
  }
  
  //if likes is not provided in the request body, return a 400 status code
  if (!req.body.likes) {
    throw updateError(400, 'Likes is required');
  }

  if (typeof req.body.likes !== 'number') {
    throw updateError(400, 'Likes must be a number');
  }

  // try {
  blog.likes = req.body.likes;
  await blog.save();
  return res.json(blog);
};

const deleteBlog = async (req: Request, res: Response) => {
  //get the id of the blog to be deleted
  const id = Number(req.params.id);

  //delete the blog with the id using sequelize using try-catch block
  await Blog.destroy({
    where: {
      id: id
    }
  });
  res.status(204).end();
};

// Define routes
router.get('/', getAllBlogs);
router.post('/', createBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;