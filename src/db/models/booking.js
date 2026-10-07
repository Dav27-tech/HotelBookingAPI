// Import the Sequelize instance from the database connection library
import { sequelize } from "../../libraries/DBConnection.js";
// Import DataTypes from sequelize to define column types
import { DataTypes } from "sequelize";

// Define the name of the booking table
export const BOOKING_TABLE = "booking";

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
        model: "user",
        key: "id",
      },
    },
    room: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "room",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by",
      references: {
        model: "user",
        key: "id",
      },
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "check_in_date",
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "check_out_date",
    },
    guestsCount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      field: "guests_count",
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "booking_status",
        key: "id",
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_price",
      validate: {
        min: 0,
      },
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "cancelled_at",
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
    tableName: BOOKING_TABLE,
    modelName: "booking",
    timestamps: true,
    validate: {
      checkOutDateAfterCheckInDate() {
        if (
          this.checkInDate &&
          this.checkOutDate &&
          new Date(this.checkOutDate) <= new Date(this.checkInDate)
        ) {
          throw new Error("check_out_date must be after check_in_date");
        }
      },
    },
  },
);
