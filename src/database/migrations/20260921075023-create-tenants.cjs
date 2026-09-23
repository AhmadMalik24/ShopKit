'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tenants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      custom_domain: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      logo_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      primary_color: {
        type: Sequelize.STRING(7),
        defaultValue: '#3B82F6',
      },
      secondary_color: {
        type: Sequelize.STRING(7),
        defaultValue: '#1E40AF',
      },
      business_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      whatsapp_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      contact_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      subscription_status: {
        type: Sequelize.ENUM('trial', 'active', 'past_due', 'suspended', 'cancelled'),
        defaultValue: 'trial',
      },
      subscription_plan: {
        type: Sequelize.ENUM('starter', 'growth', 'pro'),
        defaultValue: 'starter',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tenants');
  },
};