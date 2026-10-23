// Import the Sequelize instance from the database connection library
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the message table
export const MESSAGE_TABLE = 'message';

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
        model: 'conversation',
        key: 'id',
      },
    },
    sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
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
      field: 'send_at',
    },
  },
  {
    sequelize,
    tableName: MESSAGE_TABLE,
    modelName: 'message',
    timestamps: false,
  }
);
