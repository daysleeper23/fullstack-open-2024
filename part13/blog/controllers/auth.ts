const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

import { Request, Response } from 'express';
import { loginError } from '../middlewares/errorMiddleware';
const User = require('../models/user');

declare module 'express-session' {
  interface SessionData {
    user?: { 
      username: string
      , id: number
      , token: string 
    };
  }
}

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body;
  
  const user = await User.findOne({ where: { username: body.username } });

  if (!user || body.password !== 'password') {
    throw loginError(401, 'Invalid username or password');
  }

  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(userForToken, SECRET);
  req.session.user = {
    username: user.username,
    id: user.id,
    token: token
  };

  res.status(200).send({ token, username: user.username, name: user.name });
});



module.exports = router;