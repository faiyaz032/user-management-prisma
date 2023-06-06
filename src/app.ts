//dependencies
require('dotenv');

import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import prisma from './config/prisma';
import globalErrorMiddleware from './middlewares/globalErrorMiddleware';
import notFoundMiddleware from './middlewares/notFoundHandler';
import userRouter from './routes/user.routes';

//initialize the app
const app: Application = express();

//middlewares
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan('dev'));

app.use(express.json());
app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
  })
);
declare module 'express-session' {
  interface SessionData {
    user: object;
  }
}

app.use('/api/user', userRouter);

app.all('*', notFoundMiddleware);
app.use(globalErrorMiddleware);

//default export app
export default app;
