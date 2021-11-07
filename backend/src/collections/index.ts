import express from 'express';
// import error from 'utils/error';
import * as db from './db';

const app = express.Router();

app.get('/:slug/:page', async (req, res, next) => {
  try {
    res.json(await db.one(req.params.slug, req.params.page));
  } catch (e) {
    next(e);
  }
});

app.get('/', async (req, res, next) => {
  try {
    return res.json(await db.all());
  } catch (e) {
    next(e);
  }
});

export default app;
