// src/database/models/Template.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const Template = sequelize.define(
    'Template',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'general',
        },
        preview_image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        blocks: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
    },
    {
        tableName: 'templates',
        timestamps: true,
        underscored: true,
    }
);

Template.associate = (models) => {
    Template.hasMany(models.Tenant, {
        foreignKey: 'template_id',
        as: 'tenants',
    });
};

export default Template;