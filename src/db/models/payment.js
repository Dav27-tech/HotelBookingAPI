// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the payment table
export const PAYMENT_TABLE = "payment";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the payment table
export const PAYMENT_TABLE = 'payment';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

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
<<<<<<< HEAD
        model: "booking",
        key: "id",
=======
        model: 'booking',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
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
<<<<<<< HEAD
        model: "payment_method",
        key: "id",
=======
        model: 'payment_method',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "payment_status",
        key: "id",
=======
        model: 'payment_status',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: false,
<<<<<<< HEAD
      field: "paid_at",
=======
      field: 'paid_at',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    processedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
<<<<<<< HEAD
      field: "processed_by",
      references: {
        model: "user",
        key: "id",
=======
      field: 'processed_by',
      references: {
        model: 'user',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
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
    tableName: PAYMENT_TABLE,
<<<<<<< HEAD
    modelName: "payment",
    timestamps: true,
  },
=======
    modelName: 'payment',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
