'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'room_type' table
    await queryInterface.createTable(
      'room_type',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        price_per_night: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        max_occupancy: {
          type: Sequelize.SMALLINT,
          allowNull: false,
        },
        amenities: {
          type: Sequelize.JSONB,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );

    // CHECK constraint: price_per_night between 10 and 10000
    await queryInterface.sequelize.query(
      'ALTER TABLE "room_type" ADD CONSTRAINT "chk_room_type_price_per_night" CHECK ("price_per_night" BETWEEN 10 AND 10000);'
    );

    // CHECK constraint: max_occupancy between 1 and 10
    await queryInterface.sequelize.query(
      'ALTER TABLE "room_type" ADD CONSTRAINT "chk_room_type_max_occupancy" CHECK ("max_occupancy" BETWEEN 1 AND 10);'
    );
  },

  async down(queryInterface, Sequelize) {
    // Down - drop the 'room_type' table
    await queryInterface.dropTable('room_type');
  }
};
