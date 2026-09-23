'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      customer_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      order_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      customer_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      delivery_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      delivery_type: {
        type: Sequelize.ENUM('pickup', 'local_delivery', 'courier'),
        defaultValue: 'local_delivery',
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        defaultValue: 'pending',
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      delivery_fee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      payment_method: {
        type: Sequelize.ENUM('cod', 'jazzcash', 'easypaisa', 'card'),
        defaultValue: 'cod',
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

   // await queryInterface.addIndex('orders', ['tenant_id']);
   // await queryInterface.addIndex('orders', ['order_number']);
   // await queryInterface.addIndex('orders', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  },
};