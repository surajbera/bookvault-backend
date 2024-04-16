import app from './src/app';
import { config } from './src/config/config';

const startServer = () => {
  const port = process.env.PORT || 3000;
  console.log(config);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
