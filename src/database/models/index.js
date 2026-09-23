// src/database/models/index.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

import User from './User.js';
import Tenant from './Tenant.js';
import RefreshToken from './RefreshToken.js';

const models = {
  User,
  Tenant,
  RefreshToken,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, DataTypes };
export default models;