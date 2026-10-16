// Import the Sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the payment table
export const PAYMENT_TABLE = 'payment';

// Define the payment model
export const Payment = sequelize.define(
  PAYMENT_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    booking: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'booking',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    method: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payment_method',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'payment_status',
        key: 'id',
      },
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'paid_at',
    },
    processedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'processed_by',
      references: {
        model: 'user',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: PAYMENT_TABLE,
    modelName: 'payment',
    timestamps: true,
  }
);
