const express = require('express');
import { Request, Response } from 'express';
import { createError, updateError } from '../middlewares/errorMiddleware';
import { authenticate, AuthenticatedRequest } from '../middlewares/authMiddleware';
const { Blog, User } = require('../models');

const router = express.Router();

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.findAll({ 
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
};

const getOneUserById = async (req: Request, res: Response) => {
  let where = {};
  if (req.query.read === 'true' || req.query.read === 'false') {

    const readQuery = req.query.read === 'true' ? true : false;
    where = {
      read: readQuery
    };
  }

  const id = req.params.id;
  const user = await User.findByPk(id, {
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['read', 'id'],
        where: where
      },
      attributes: { 
        exclude: ['createdAt', 'updatedAt', 'userId', 'readingList'] 
      }
    },
    
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
}

const createUser = async(req: AuthenticatedRequest, res: Response) => {

  const body = req.body;

  if (!body.username) {
    throw createError(400, 'Username is required');
  }

  if (!body.name) {
    throw createError(400, 'Name is required');
  }

  if (typeof body.username !== 'string' || typeof body.name !== 'string') {
    throw createError(400, 'Username and Name must be strings');
  }

  const user = User.build(body);

  await user.save();
  res.json(user);
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {

  const username = req.params.username;

  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    throw updateError(404, 'User not found');
  }

  if (!req.body.username) {
    throw updateError(400, 'Username is required');
  }

  if (typeof req.body.username !== 'string') {
    throw updateError(400, 'Username must be a string');
  }

  user.username = req.body.username;
  await user.save();
  res.json(user);
}

const enableUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);
  if (!user) {
    throw updateError(404, 'User not found');
  }

  user.enabled = true;
  await user.save();
  res.json(user);
};

const disableUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const user = await User.findByPk(id);
  if (!user) {
    throw updateError(404, 'User not found');
  }

  user.enabled = false;
  await user.save();

  res.json(user);
};

router.get('/', getAllUsers);
router.get('/:id', getOneUserById);
router.post('/', authenticate, createUser);
router.post('/disable/:id', authenticate, disableUser);
router.post('/enable/:id', authenticate, enableUser);
router.put('/:username', authenticate, updateUser);

module.exports = router;