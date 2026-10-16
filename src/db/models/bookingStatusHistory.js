// Import the Sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the booking status history table
export const BOOKING_STATUS_HISTORY_TABLE = 'booking_status_history';

// Define the booking status history model
export const BookingStatusHistory = sequelize.define(
  BOOKING_STATUS_HISTORY_TABLE,
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
    fromStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'from_status',
      references: {
        model: 'booking_status',
        key: 'id',
      },
    },
    toStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'to_status',
      references: {
        model: 'booking_status',
        key: 'id',
      },
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'changed_by',
      references: {
        model: 'user',
        key: 'id',
      },
    },
    changedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'changed_at',
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
    tableName: BOOKING_STATUS_HISTORY_TABLE,
    modelName: 'booking_status_history',
    timestamps: true,
  }
);
