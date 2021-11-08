import express from 'express';
// import error from 'utils/error';
import * as db from './db';

const app = express.Router();

app.post('/:slug', async (req, res, next) => {
  try {
    res.json(
      await db.one(req.params.slug, req.body.page ?? 1, req.body.filters ?? {})
    );
  } catch (e) {
    next(e);
  }
});

app.post('/', async (req, res, next) => {
  try {
    return res.json(await db.all());
  } catch (e) {
    next(e);
  }
});

export default app;
