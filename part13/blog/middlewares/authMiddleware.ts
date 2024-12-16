import { Session } from 'express-session';
import { Request, Response, NextFunction } from 'express';
import { unauthorizeError } from './errorMiddleware';
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

export interface AuthenticatedRequest extends Request {
  session: Session & {
    user: {
      id: number;
      username: string;
      token: string;
    };
  };
}

// const tokenExtractor = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const authorization = req.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
//   }  else {
//     return res.status(401).json({ error: 'token missing' })
//   }
//   return next()
// }

const authenticate = (req: Request, _res: Response, next: NextFunction) => {

  if (!req.session) {
    throw unauthorizeError(401, 'Session not found');
  }

  if (!req.session.user) {
    throw unauthorizeError(401, 'User not logged in');
  }

  if (!req.session.user.token || !jwt.verify(req.session.user.token, SECRET)) {
    throw  unauthorizeError(401, 'Invalid token');
  }

  (req as AuthenticatedRequest).session.user = req.session.user;

  return next();
}

export { authenticate };