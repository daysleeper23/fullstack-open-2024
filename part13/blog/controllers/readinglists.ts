const express = require('express');

import { Request, Response } from 'express';
import { updateError } from '../middlewares/errorMiddleware';
import { authenticate, AuthenticatedRequest } from '../middlewares/authMiddleware';
const { ReadingList, User, Blog } = require('../models');

const router = express.Router();

const getAllReadingLists = async (_req: Request, res: Response) => {
  const readingLists = await ReadingList.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(readingLists);
};

const getReadingList = async (req: Request, res: Response) => {
  const readingList = await ReadingList.findByPk(req.params.id, {
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });

  if (readingList) {
    res.json(readingList);
  } else {
    res.status(404).end();
  }
}

const addBlogToReadingList = async(req: AuthenticatedRequest, res: Response) => {

  const { blogId, userId } = req.body;

  if (!blogId) {
    throw updateError(400, 'Blog Id  is required');
  }

  if (!userId) {
    throw updateError(400, 'User Id  is required');
  }

  if (typeof blogId !== 'number' || typeof userId !== 'number') {
    throw updateError(400, 'Blog Id and User Id must be numbers');
  }

  let user;
  try {
    user = await User.findByPk(Number(userId));
  } catch (error) {
    console.log(error);
  }

  if (!user || user === null) {
    throw updateError(404, 'User not found');
  }

  let blog;
  try {
    blog = await Blog.findByPk(Number(blogId));
  } catch (error) {
    console.log(error);
  }
  if (!blog || blog === null) {
    throw updateError(404, 'Blog not found');
  }

  let list;
  try {
    list = await ReadingList.findOne({ 
      where: { 
        user_id: userId,
        blog_id: blogId
      },
    });
  } catch (error) {
    console.log(error);
  }
  
  if (!list) {
    list = ReadingList.build({ 
      userId: userId, 
      blogId: blogId, 
      read: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    try {
      await list.save();
      res.json(list);
    }
    catch (error) {
      console.log(error);
    }
  } else {
    throw updateError(400, 'Blog already in reading list');
  }
}

const updateBlogInReadingList = async(req: AuthenticatedRequest, res: Response) => {

  const auth = req.session.user;
  const { read } = req.body;
  const id = Number(req.params.id);

  if (read === undefined) {
    throw updateError(400, 'Read status is required');
  }

  if (typeof read !== 'boolean') {
    throw updateError(400, 'Read status must be a boolean');
  }

  if (read !== true) {
    throw updateError(400, 'Read status must be true');
  }

  const list = await ReadingList.findByPk(id);

  if (!list) {
    throw updateError(404, 'Reading list not found');
  }

  if (list.userId !== auth.id) {
    throw updateError(401, 'Cannot update reading list for other users');
  }

  list.read = true;

  try {
    await list.save();
    res.json(list);
  } catch (error) {
    console.log(error);
  }
}

router.get('/', getAllReadingLists);
router.get('/:id', getReadingList);
router.post('/', authenticate, addBlogToReadingList);
router.put('/:id', authenticate, updateBlogInReadingList);

module.exports = router;