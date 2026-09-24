'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create templates table if it doesn't exist
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('templates')) {
      await queryInterface.createTable('templates', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        slug: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        category: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'general',
        },
        preview_image_url: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        display_order: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        blocks: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: [],
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
    }

    // 2. Add tenant columns if they don't exist
    const tenantCols = await queryInterface.describeTable('tenants');

    if (!tenantCols.template_id) {
      await queryInterface.addColumn('tenants', 'template_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'templates', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    if (!tenantCols.has_seen_onboarding) {
      await queryInterface.addColumn('tenants', 'has_seen_onboarding', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tenantCols = await queryInterface.describeTable('tenants');

    if (tenantCols.has_seen_onboarding) {
      await queryInterface.removeColumn('tenants', 'has_seen_onboarding');
    }
    if (tenantCols.template_id) {
      await queryInterface.removeColumn('tenants', 'template_id');
    }

    await queryInterface.dropTable('templates');
  },
};