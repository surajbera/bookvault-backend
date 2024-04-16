const _config = {
  port: process.env.PORT,
};

// creating the config read only using Object.freeze()
export const config = Object.freeze(_config);
