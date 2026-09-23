// src/database/connection/index.js
import pkg from 'sequelize';
const { Sequelize } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to the database via Sequelize');
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default sequelize;