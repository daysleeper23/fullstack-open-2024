const express = require('express');
const { Op } = require('sequelize');
import { authenticate, AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createError, deleteError, updateError } from '../middlewares/errorMiddleware';
import { Request, Response } from 'express';
const { Blog, User } = require('../models');

const router = express.Router();

const getAllBlogs = async (req: Request, res: Response) => {
  let where = {};

  if (req.query.search) {
    where = { 
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    };
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
   });
   
  res.json(blogs);
};

const createBlog = async (req: AuthenticatedRequest, res: Response) => {

  //read the body of the request
  const body = req.body;
  const auth = req.session.user;

  if (!body.title) {
    throw createError(400, 'Title is required');
  }

  if (!body.url) {
    throw createError(400, 'URL is required');
  }

  if (typeof body.title !== 'string' || typeof body.url !== 'string') {
    throw createError(400, 'Title and URL must be strings');
  }

  if (body.author && typeof body.author !== 'string') {
    throw createError(400, 'Author must be a string');
  }

  const urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/;
  if (!urlPattern.test(body.url)) {
    throw createError(400, 'URL must be a valid URL');
  }

  if (body.likes !== undefined && (!Number.isInteger(body.likes) || body.likes < 0)) {
    throw createError(400, 'Likes must be a non-negative integer');
  }

  if (body.year && isNaN(Number(body.year))) {
    throw createError(400, 'Year must be a number');
  }

  if (body.year < 1991 || body.year > new Date().getFullYear()) {
    throw createError(400, 'Year must be between 1991 and the current year');
  }

  //create a new blog object with the body of the request using sequelize
  const blog = Blog.build(body);

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const user = await User.findByPk(auth.id);
  if (!user) {
    throw createError(401, 'User not found');
  }
  blog.userId = user.id;

  //save the blog object to the database using try-catch block
  await blog.save();
  res.json(blog);
};

const getBlogById = (req: Request, res: Response) => {
  res.send(`Get blog with ID ${req.params.id}`);
};

const updateBlog = async (req: AuthenticatedRequest, res: Response) => {

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

  if (req.body.likes < 0) {
    throw updateError(400, 'Likes must be a non-negative number');
  }

  // try {
  blog.likes = req.body.likes;
  await blog.save();
  return res.json(blog);
};

const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {

  const auth = req.session.user;

  //get the id of the blog to be deleted
  const id = Number(req.params.id);
  if (isNaN(id) || id < 0 || !Number.isInteger(id)) {
    throw deleteError(400, 'Invalid blog id');
  }
  
  //find the blog with the id using sequelize
  const blog = await Blog.findByPk(id);
  if (!blog) {
    throw deleteError(404, 'Blog not found');
  }

  if (blog.userId !== auth.id) {
    throw deleteError(401, 'Cannot delete blogs created by other users');
  }

  //delete the blog with the id using sequelize using try-catch block
  await Blog.destroy({
    where: {
      id: id,
      userId: auth.id
    }
  });
  res.status(204).end();
};

// Define routes
router.get('/', getAllBlogs);
router.post('/', authenticate, createBlog);
router.get('/:id', getBlogById);
router.put('/:id', authenticate, updateBlog);
router.delete('/:id', authenticate, deleteBlog);

module.exports = router;