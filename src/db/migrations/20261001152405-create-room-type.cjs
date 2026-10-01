"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'room_type' table
    await queryInterface.createTable("room_type", {
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
      price_per_night: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      max_occupancy: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      amenities: {
        type: DataTypes.JSONB,
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

    // CHECK constraint: price_per_night between 10 and 10000
    await queryInterface.sequelize.query(
      'ALTER TABLE "room_type" ADD CONSTRAINT "chk_room_type_price_per_night" CHECK ("price_per_night" BETWEEN 10 AND 10000);',
    );

    // CHECK constraint: max_occupancy between 1 and 10
    await queryInterface.sequelize.query(
      'ALTER TABLE "room_type" ADD CONSTRAINT "chk_room_type_max_occupancy" CHECK ("max_occupancy" BETWEEN 1 AND 10);',
    );
  },

  async down(queryInterface, Sequelize) {
    // UP - create the 'room_type' table
    await queryInterface.dropTable("room_type");
  },
};
