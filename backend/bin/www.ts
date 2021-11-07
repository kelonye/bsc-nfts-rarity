import dotenv from 'dotenv';
import app from '../src';

dotenv.config();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
