// Import the Sequelize instance from the database connection library
<<<<<<< HEAD
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the booking table
export const BOOKING_TABLE = "booking";
=======
import { sequelize } from '../../libraries/DBConnection.js';
// Import DataTypes from sequelize to define column types
import { DataTypes } from 'sequelize';

// Define the name of the booking table
export const BOOKING_TABLE = 'booking';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Define the booking model
export const Booking = sequelize.define(
  BOOKING_TABLE,
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    guest: {
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
    room: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "room",
        key: "id",
=======
        model: 'room',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
<<<<<<< HEAD
      field: "created_by",
      references: {
        model: "user",
        key: "id",
=======
      field: 'created_by',
      references: {
        model: 'user',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
<<<<<<< HEAD
      field: "check_in_date",
=======
      field: 'check_in_date',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
<<<<<<< HEAD
      field: "check_out_date",
=======
      field: 'check_out_date',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    },
    guestsCount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
<<<<<<< HEAD
      field: "guests_count",
      validate: {
        min: 1,
=======
      field: 'guests_count',
      validate: {
        min: 1,
        max: 10,
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
<<<<<<< HEAD
        model: "booking_status",
        key: "id",
=======
        model: 'booking_status',
        key: 'id',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
<<<<<<< HEAD
      field: "total_price",
=======
      field: 'total_price',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
      validate: {
        min: 0,
      },
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
<<<<<<< HEAD
      field: "cancelled_at",
=======
      field: 'cancelled_at',
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
    tableName: BOOKING_TABLE,
<<<<<<< HEAD
    modelName: "booking",
=======
    modelName: 'booking',
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
    timestamps: true,
    validate: {
      checkOutDateAfterCheckInDate() {
        if (
          this.checkInDate &&
          this.checkOutDate &&
          new Date(this.checkOutDate) <= new Date(this.checkInDate)
        ) {
<<<<<<< HEAD
          throw new Error("check_out_date must be after check_in_date");
        }
      },
    },
  },
=======
          throw new Error('check_out_date must be after check_in_date');
        }
      },
    },
  }
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
);
