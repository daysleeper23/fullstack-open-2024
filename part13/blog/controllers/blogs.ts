const express = require('express');
const jwt = require('jsonwebtoken');

const { Op } = require('sequelize');
import { createError, deleteError, updateError } from '../util/middleware';
import { NextFunction, Request, Response } from 'express';
const { Blog, User } = require('../models');

const router = express.Router();

interface AuthenticatedRequest extends Request {
  decodedToken?: { id: string }; // decodedToken should be an object containing an id property
}

const tokenExtractor = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  return next()
}

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
  if (!req.decodedToken) {
    throw createError(401, 'Token missing or invalid');
  }

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const user = await User.findByPk(req.decodedToken.id);
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
  if (!req.decodedToken) {
    throw updateError(401, 'Token missing or invalid');
  }

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
  if (!req.decodedToken) {
    throw deleteError(401, 'Token missing or invalid');
  }

  if (!req.decodedToken.id) {
    throw deleteError(401, 'User id missing');
  }

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

  if (blog.userId !== req.decodedToken.id) {
    throw deleteError(401, 'Cannot delete blogs created by other users');
  }

  //delete the blog with the id using sequelize using try-catch block
  await Blog.destroy({
    where: {
      id: id,
      userId: req.decodedToken.id
    }
  });
  res.status(204).end();
};

// Define routes
router.get('/', getAllBlogs);
router.post('/', tokenExtractor, createBlog);
router.get('/:id', getBlogById);
router.put('/:id', tokenExtractor, updateBlog);
router.delete('/:id', tokenExtractor, deleteBlog);

module.exports = router;