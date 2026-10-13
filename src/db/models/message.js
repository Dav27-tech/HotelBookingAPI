// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the message table
export const MESSAGE_TABLE = "message";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the message table
export const MESSAGE_TABLE = 'message';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the message model
export const Message = sequelize.define(
  MESSAGE_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    conversation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "conversation",
        key: "id",
=======
        model: 'conversation',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    sender: {
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
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sendAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
<<<<<<< HEAD
      field: "send_at",
=======
      field: 'send_at',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
  },
  {
    sequelize,
    tableName: MESSAGE_TABLE,
<<<<<<< HEAD
    modelName: "message",
    timestamps: false,
  },
=======
    modelName: 'message',
    timestamps: false,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
