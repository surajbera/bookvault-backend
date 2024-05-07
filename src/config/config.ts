import { config as conf } from 'dotenv';
conf();

// variables starting with an underscore (_) are treated as private by developers
const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  saltRounds: process.env.SALT_ROUNDS,
  jwtSecret: process.env.JWT_SECRET,
};

// creating the config read only using Object.freeze()
export const config = Object.freeze(_config);
