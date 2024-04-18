import { config as conf } from 'dotenv';
conf();

// variables starting with an underscore (_) are treated as private by developers
const _config = {
  port: process.env.PORT,
};

// creating the config read only using Object.freeze()
export const config = Object.freeze(_config);
