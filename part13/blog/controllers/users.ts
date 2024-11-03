const express = require('express');
import { Request, Response } from 'express';
import { createError, updateError } from '../util/middleware';
const { User } = require('../models');

const router = express.Router();

const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.findAll({ raw: true });
  res.json(users);
};

const createUser = async(req: Request, res: Response) => {
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
}

const updateUser = async (req: Request, res: Response) => {
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

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:username', updateUser);

module.exports = router;