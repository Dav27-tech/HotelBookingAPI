// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the phone table
export const PHONE_TABLE = "phone";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the phone table
export const PHONE_TABLE = 'phone';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the phone model
export const Phone = sequelize.define(
  // Table name
  PHONE_TABLE,
  // Table columns
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING(20),
      allowNull: false,
<<<<<<< HEAD
      unique: true,
=======
      unique: true
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "user",
        key: "id",
=======
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
    tableName: PHONE_TABLE,
<<<<<<< HEAD
    modelName: "phone",
    timestamps: true,
  },
=======
    modelName: 'phone',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
