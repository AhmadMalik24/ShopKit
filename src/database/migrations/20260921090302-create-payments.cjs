'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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
      order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'subscriptions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: {
        type: Sequelize.ENUM('customer_order', 'subscription'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM('cod', 'jazzcash', 'easypaisa', 'card'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      paid_at: {
        type: Sequelize.DATE,
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

    //await queryInterface.addIndex('payments', ['tenant_id']);
    //await queryInterface.addIndex('payments', ['order_id']);
    //await queryInterface.addIndex('payments', ['subscription_id']);
    //await queryInterface.addIndex('payments', ['type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  },
};