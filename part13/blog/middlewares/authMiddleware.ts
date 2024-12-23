import { Session } from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { unauthorizeError } from './errorMiddleware';
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { User } = require('../models');

export interface AuthenticatedRequest extends Request {
  session: Session & {
    user: {
      id: number;
      username: string;
      token: string;
    };
  };
}

const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  console.log('---Start authenticate: ');
  console.log('User:', req.session.user, 'Session:', req.session.user);
  if (!req.session) {
    throw unauthorizeError(401, 'Session not found');
  }

  if (!req.session.user) {
    throw unauthorizeError(401, 'User not logged in');
  }

  if (!req.session.user.token || !jwt.verify(req.session.user.token, SECRET)) {
    throw  unauthorizeError(401, 'Invalid token');
  }

  const existingUser = await User.findByPk(req.session.user.id);

  //revoke session if user not found
  if (existingUser === null || existingUser === undefined) {
    console.log('--- User not found, destroying session');
    req.session.destroy((err: Error) => {
      if (err) {
        console.log('Error destroying session', err);
      }
    });
    throw unauthorizeError(401, 'User not found');
  }

  //revoke session if user is disabled
  if (existingUser.enabled === false) {
    console.log('--- User disabled, destroying session');
    req.session.destroy((err: Error) => {
      if (err) {
        console.log('Error destroying session', err);
      }
    });
    throw unauthorizeError(401, 'User is disabled');
  }

  (req as AuthenticatedRequest).session.user = req.session.user;

  console.log('---End authenticate: OK');
  return next();
}

export { authenticate };