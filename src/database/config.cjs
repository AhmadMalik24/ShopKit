// src/database/config.cjs
require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true';

const baseConfig = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
};

module.exports = {
  development: baseConfig,
  production: baseConfig,
  test: baseConfig,
};