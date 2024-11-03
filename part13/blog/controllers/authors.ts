import express from 'express';
import { Request, Response } from 'express';
const { sequelize } = require('../util/db');
const { Blog } = require('../models');
const router = express.Router();

const getAllAuthors = async (_req: Request, res: Response) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
  });
  
  res.json(authors);
};

router.get('/', getAllAuthors);

module.exports = router;

