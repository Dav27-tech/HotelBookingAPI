"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'user' table
    await queryInterface.createTable("room", {
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
          model: "room_type",
          key: "id",
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
          model: "room_status",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // UP - create the 'room' table
    await queryInterface.dropTable("room");
  },
};
