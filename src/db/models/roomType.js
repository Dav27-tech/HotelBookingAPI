// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the room type table
export const ROOM_TYPE_TABLE = "room_type";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the room type table
export const ROOM_TYPE_TABLE = 'room_type';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the room type model
export const RoomType = sequelize.define(
  ROOM_TYPE_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pricePerNight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
<<<<<<< HEAD
      field: "price_per_night",
=======
      field: 'price_per_night',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      validate: {
        min: 10,
        max: 10000,
      },
    },
    maxOccupancy: {
      type: DataTypes.SMALLINT,
      allowNull: false,
<<<<<<< HEAD
      field: "max_occupancy",
=======
      field: 'max_occupancy',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      validate: {
        min: 1,
        max: 10,
      },
    },
    amenities: {
      type: DataTypes.JSONB,
      allowNull: false,
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
    tableName: ROOM_TYPE_TABLE,
<<<<<<< HEAD
    modelName: "room_type",
    timestamps: true,
  },
=======
    modelName: 'room_type',
    timestamps: true,
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
