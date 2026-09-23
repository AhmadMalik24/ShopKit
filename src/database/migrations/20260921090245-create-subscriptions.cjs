'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'tenants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      plan: {
        type: Sequelize.ENUM('starter', 'growth', 'pro'),
        defaultValue: 'starter',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 1500,
      },
      status: {
        type: Sequelize.ENUM('active', 'past_due', 'suspended', 'cancelled'),
        defaultValue: 'active',
      },
      current_period_start: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      current_period_end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      next_billing_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payment_method_token: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      payment_method_last4: {
        type: Sequelize.STRING(4),
        allowNull: true,
      },
      cancelled_at: {
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

    //await queryInterface.addIndex('subscriptions', ['status']);
    //await queryInterface.addIndex('subscriptions', ['next_billing_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  },
};