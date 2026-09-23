'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      default_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      total_orders: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_spent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
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

    //await queryInterface.addIndex('customers', ['tenant_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  },
};