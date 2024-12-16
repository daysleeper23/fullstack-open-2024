const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const User = require('../models/user');

import { Request, Response } from 'express';
import { loginError } from '../middlewares/errorMiddleware';
import { authenticate, AuthenticatedRequest } from '../middlewares/authMiddleware';


const router = express.Router();

const authLogin = async (req: Request, res: Response) => {
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

  res.status(200).send({ 
    token
    , username: user.username
    , name: user.name
    , sid: req.session.id });
}

const authLogout = async (req: AuthenticatedRequest, res: Response) => {
  await req.session.destroy((err: Error) => {
    if (err) {
      console.log('Error destroying session', err);
      return res.status(500).json({ message: 'Could not log out' });
    }

    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
}

router.post('/login', authLogin);
router.delete('/logout', authenticate, authLogout);


module.exports = router;