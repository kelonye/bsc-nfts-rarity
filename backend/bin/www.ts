import '../src/utils/dotenv';
import app from '../src';

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
