// src/database/models/User.js
import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequelize from '../connection/index.js';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('super_admin', 'store_owner', 'customer'),
            allowNull: false,
            defaultValue: 'store_owner',
        },
        whatsapp_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        timestamps: true,
        underscored: true,
    }
);

User.associate = (models) => {
    User.belongsTo(models.Tenant, {
        foreignKey: 'tenant_id',
        as: 'tenant',
    });
};

export default User;