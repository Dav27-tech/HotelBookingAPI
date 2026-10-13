// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the room table
export const ROOM_TABLE = "room";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the room table
export const ROOM_TABLE = 'room';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the room model
export const Room = sequelize.define(
  ROOM_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "room_type",
        key: "id",
=======
        model: 'room_type',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    floor: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "room_status",
        key: "id",
=======
        model: 'room_status',
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
    tableName: ROOM_TABLE,
<<<<<<< HEAD
    modelName: "room",
    timestamps: true,
  },
=======
    modelName: 'room',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
