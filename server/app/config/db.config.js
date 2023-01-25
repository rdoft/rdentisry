module.exports = {
  HOST: process.env.DB_HOST,
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
};
