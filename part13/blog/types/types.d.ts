require('express-session');

declare module 'express-session' {
  interface SessionData {
    user?: { 
      username: string
      , id: number
      , token: string 
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      session?: Session & Partial<SessionData>;
    }
  }
}