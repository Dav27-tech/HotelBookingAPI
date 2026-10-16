// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the booking status history table
export const BOOKING_STATUS_HISTORY_TABLE = "booking_status_history";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the booking status history table
export const BOOKING_STATUS_HISTORY_TABLE = 'booking_status_history';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

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
<<<<<<< HEAD
        model: "booking",
        key: "id",
=======
        model: 'booking',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    fromStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
<<<<<<< HEAD
      field: "from_status",
      references: {
        model: "booking_status",
        key: "id",
=======
      field: 'from_status',
      references: {
        model: 'booking_status',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    toStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
<<<<<<< HEAD
      field: "to_status",
      references: {
        model: "booking_status",
        key: "id",
=======
      field: 'to_status',
      references: {
        model: 'booking_status',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
<<<<<<< HEAD
      field: "changed_by",
      references: {
        model: "user",
        key: "id",
=======
      field: 'changed_by',
      references: {
        model: 'user',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    changedAt: {
      type: DataTypes.DATE,
      allowNull: false,
<<<<<<< HEAD
      field: "changed_at",
=======
      field: 'changed_at',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
<<<<<<< HEAD
      field: "created_at",
=======
      field: 'created_at',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
<<<<<<< HEAD
      field: "updated_at",
=======
      field: 'updated_at',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
  },
  {
    sequelize,
    tableName: BOOKING_STATUS_HISTORY_TABLE,
<<<<<<< HEAD
    modelName: "booking_status_history",
    timestamps: true,
  },
=======
    modelName: 'booking_status_history',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
