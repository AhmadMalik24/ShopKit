// src/database/models/Tenant.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const Tenant = sequelize.define(
    'Tenant',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        custom_domain: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true,
        },
        logo_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        primary_color: {
            type: DataTypes.STRING(7),
            defaultValue: '#3B82F6',
        },
        secondary_color: {
            type: DataTypes.STRING(7),
            defaultValue: '#1E40AF',
        },
        business_type: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        whatsapp_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        contact_email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        subscription_status: {
            type: DataTypes.ENUM('trial', 'active', 'past_due', 'suspended', 'cancelled'),
            defaultValue: 'trial',
        },
        subscription_plan: {
            type: DataTypes.ENUM('starter', 'growth', 'pro'),
            defaultValue: 'starter',
        },
    },
    {
        tableName: 'tenants',
        timestamps: true,
        underscored: true,
    }
);

Tenant.associate = (models) => {
    Tenant.hasMany(models.User, {
        foreignKey: 'tenant_id',
        as: 'users',
    });
    Tenant.hasMany(models.Block, {
        foreignKey: 'tenant_id',
        as: 'blocks',
    });
    Tenant.belongsTo(models.Template, {
        foreignKey: 'template_id',
        as: 'template',
    });
    Tenant.hasMany(models.Product, {
        foreignKey: 'tenant_id', as: 'products'
    });
    Tenant.hasMany(models.Order, {
        foreignKey: 'tenant_id',
        as: 'orders',
    });
    Tenant.belongsTo(models.User, {
        foreignKey: 'owner_id',
        as: 'owner',       // ← this is what the service queries
    });
};

export default Tenant;