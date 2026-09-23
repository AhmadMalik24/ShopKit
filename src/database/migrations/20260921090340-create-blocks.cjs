'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blocks', {
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
      type: {
        type: Sequelize.ENUM('hero', 'products', 'about', 'testimonials', 'contact', 'footer', 'gallery', 'cta'),
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      config: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      styles: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      animation: {
        type: Sequelize.JSONB,
        defaultValue: {
          type: 'fadeIn',
          duration: 600,
          delay: 0,
          trigger: 'onLoad',
        },
      },
      is_visible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    //await queryInterface.addIndex('blocks', ['tenant_id']);
    //await queryInterface.addIndex('blocks', ['type']);
    //await queryInterface.addIndex('blocks', ['position']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blocks');
  },
};