const express = require('express');
const jwt = require('jsonwebtoken');

import { Request, Response } from 'express';
import { loginError } from '../util/middleware';
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const body = req.body;
  
  const user = await User.findOne({ where: { username: body.username } });

  if (!user || body.password !== 'password') {
    throw loginError(401, 'Invalid username or password');
  }

  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;