import express from 'express';
import { Request, Response } from 'express';
import { updateError } from '../util/middleware';
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

const addBlogToReadingList = async(req: Request, res: Response) => {
  const { blogId, userId } = req.body;
  console.log('blogId', blogId, 'userId', userId);  

  if (!blogId) {
    throw updateError(400, 'Blog Id  is required');
  }

  if (!userId) {
    throw updateError(400, 'User Id  is required');
  }

  if (typeof blogId !== 'number' || typeof userId !== 'number') {
    throw updateError(400, 'Blog Id and User Id must be numbers');
  }

  const user = await User.findByPk(Number(userId));
  if (!user || user === null) {
    throw updateError(404, 'User not found');
  }

  try {
    const blog = await Blog.findByPk(Number(blogId));
    if (!blog || blog === null) {
      throw updateError(404, 'Blog not found');
    }
  }
  catch (error) {
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
      user_id: userId, 
      blog_id: blogId, 
      read: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await list.save();
    res.json(list);
  } else {
    throw updateError(400, 'Blog already in reading list');
  }
}

router.get('/', getAllReadingLists);
router.get('/:id', getReadingList);
router.post('/', addBlogToReadingList);

module.exports = router;