const log = require("./log.config");

module.exports = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  DB: process.env.DB_DB,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: (msg) => log.db.info(msg),
};
