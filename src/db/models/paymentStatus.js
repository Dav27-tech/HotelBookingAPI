// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the payment status table
export const PAYMENT_STATUS_TABLE = "payment_status";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the payment status table
export const PAYMENT_STATUS_TABLE = 'payment_status';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the payment status model
export const PaymentStatus = sequelize.define(
  PAYMENT_STATUS_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
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
    tableName: PAYMENT_STATUS_TABLE,
<<<<<<< HEAD
    modelName: "payment_status",
    timestamps: true,
  },
=======
    modelName: 'payment_status',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
