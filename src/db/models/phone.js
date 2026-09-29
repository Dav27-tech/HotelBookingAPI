// Import the Sequelize instance from the database connection library
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the phone table
export const PHONE_TABLE = "phone";

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
      unique: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
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
    tableName: PHONE_TABLE,
    modelName: "phone",
    timestamps: true,
  },
);
