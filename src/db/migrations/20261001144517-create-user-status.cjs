"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'user_status' table
    await queryInterface.createDatabase("user_status", {
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
      // Role name (e.g. 'ACTIVE', 'INACTIVE', 'DELETED')
      name: {
        // Varchar type limited to 30 characters
        type: DataTypes.STRING(30),
        // This field cannot be null
        allowNull: false,
        // Must be unique
        unique: true,
      },
      // Creation date
      created_at: {
        // Date type
        type: DataTypes.DATE,
        // This field cannot be null
        allowNull: false,
        // By default automatically generate the value
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      // Last update date
      updated_at: {
        // Date type
        type: DataTypes.DATE,
        // This field cannot be null
        allowNull: false,
        // By default automatically generate the value
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // DOWN - Drop the 'user_status' table
    await queryInterface.dropTable("user_status");
  },
};
