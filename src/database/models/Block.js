// src/database/models/Block.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const Block = sequelize.define(
  'Block',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'hero',
        'products',
        'about',
        'testimonials',
        'contact',
        'footer',
        'gallery',
        'cta'
      ),
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    config: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    styles: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    animation: {
      type: DataTypes.JSONB,
      defaultValue: { type: 'fadeIn', duration: 600, delay: 0 },
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'blocks',
    timestamps: true,
    underscored: true,
  }
);

Block.associate = (models) => {
  Block.belongsTo(models.Tenant, {
    foreignKey: 'tenant_id',
    as: 'tenant',
  });
};

export default Block;