import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { PRODUCTION, TEST } from './config';
import collections from './collections';

const app = express();

if (!TEST) {
  app.set('trust proxy', 1);
  app.use(morgan('tiny'));
  app.use(cors());
}
app.use(bodyParser.json());
app.use('/collections', collections);
app.use(function (err, req, res, next) {
  err.status = err.status || 500;
  if (!TEST) {
    console.error(err.stack);
  }
  res.status(err.status).json(PRODUCTION ? 'something broke!' : err.message);
});

export default app;
