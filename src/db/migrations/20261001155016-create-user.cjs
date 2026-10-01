"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'user' table
    await queryInterface.createTable("user", {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      first_lastname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      second_lastname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_role",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_status",
          key: "id",
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false,
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
    // UP - create the 'user' table
    await queryInterface.dropTable("user");
  },
};
