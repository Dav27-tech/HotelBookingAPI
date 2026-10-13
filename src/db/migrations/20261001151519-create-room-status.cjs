'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'room_status' table
    await queryInterface.createTable(
      'room_status',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
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
  },

  async down(queryInterface, Sequelize) {
    // DOWN - drop the 'room-status' table
    await queryInterface.dropTable('room_status');
  }
};
