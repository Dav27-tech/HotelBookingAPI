// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the user table
export const USER_TABLE = "user";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the user table
export const USER_TABLE = 'user';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the user model
export const User = sequelize.define(
  // Table name
  USER_TABLE,
  // Table columns
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
<<<<<<< HEAD
      field: "first_name",
=======
      field: 'first_name',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    middleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
<<<<<<< HEAD
      field: "middle_name",
=======
      field: 'middle_name',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    firstLastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
<<<<<<< HEAD
      field: "first_lastname",
=======
      field: 'first_lastname',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    secondLastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
<<<<<<< HEAD
      field: "second_lastname",
=======
      field: 'second_lastname',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
<<<<<<< HEAD
      },
=======
      }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "user_role",
        key: "id",
=======
        model: 'user_role',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "user_status",
        key: "id",
=======
        model: 'user_status',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: false,
<<<<<<< HEAD
      field: "last_login",
=======
      field: 'last_login',
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
    tableName: USER_TABLE,
<<<<<<< HEAD
    modelName: "user",
    timestamps: true,
  },
=======
    modelName: 'user',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
