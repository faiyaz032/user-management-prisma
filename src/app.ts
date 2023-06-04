//dependencies
require('dotenv');
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import globalErrorMiddleware from './middlewares/globalErrorMiddleware';
import notFoundMiddleware from './middlewares/notFoundHandler';

//initialize the app
const app: Application = express();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.all('*', notFoundMiddleware);
app.use(globalErrorMiddleware);

//default export app
export default app;
