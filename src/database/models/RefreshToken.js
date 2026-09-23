// src/database/models/RefreshToken.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'refresh_tokens',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

export default RefreshToken;