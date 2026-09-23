// src/database/models/Order.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const Order = sequelize.define(
  'Order',
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
    order_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    delivery_type: {
      type: DataTypes.ENUM('pickup', 'local_delivery', 'courier'),
      defaultValue: 'local_delivery',
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled'
      ),
      defaultValue: 'pending',
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    payment_method: {
      type: DataTypes.ENUM('cod', 'jazzcash', 'easypaisa', 'card'),
      defaultValue: 'cod',
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

Order.associate = (models) => {
  Order.belongsTo(models.Tenant, {
    foreignKey: 'tenant_id',
    as: 'tenant',
  });
  Order.hasMany(models.OrderItem, {
    foreignKey: 'order_id',
    as: 'items',
  });
};

export default Order;