// Import the Sequelize instance from the database connection library
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the user table
export const USER_TABLE = "user";

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
      field: "first_name",
    },
    middleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "middle_name",
    },
    firstLastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "first_lastname",
    },
    secondLastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "second_lastname",
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user_role",
        key: "id",
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user_status",
        key: "id",
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "last_login",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: USER_TABLE,
    modelName: "user",
    timestamps: true,
  },
);
