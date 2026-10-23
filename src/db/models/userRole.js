// Import the Sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the user roles table
export const ROLE_TABLE = 'user_role';

// Define the user role model
export const UserRole = sequelize.define(
  // Table name
  ROLE_TABLE,
  // Table columns
  {
    // Define the 'id' column
    id: {
      // Integer type
      type: DataTypes.INTEGER,
      // This field cannot be null
      allowNull: false,
      // Primary key
      primaryKey: true,
      // Must be unique
      unique: true,
      // Auto increment value
      autoIncrement: true,
    },
    // Role name (e.g. 'Administrator', 'Staff', 'Guest')
    name: {
      // Varchar type limited to 30 characters
      type: DataTypes.STRING(30),
      // This field cannot be null
      allowNull: false,
      // Must be unique
      unique: true,
    },
    // Creation date
    createdAt: {
      // Date type
      type: DataTypes.DATE,
      // This field cannot be null
      allowNull: false,
      // By default automatically generate the value
      defaultValue: DataTypes.NOW,
      // Database column name
      field: 'created_at',
    },
    // Last update date
    updatedAt: {
      // Date type
      type: DataTypes.DATE,
      // This field cannot be null
      allowNull: false,
      // By default automatically generate the value
      defaultValue: DataTypes.NOW,
      // Database column name
      field: 'updated_at',
    },
  },
  // Sequelize table configuration
  {
    // Pass the sequelize instance
    sequelize,
    // Specify the table name
    tableName: ROLE_TABLE,
    // Specify the model name
    modelName: 'user_role',
    // Enable automatic timestamps
    timestamps: true,
  }
);
