import exp from 'constants';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { 
      username: string
      , id: number
      , token: string 
    };
  }
}

export {};