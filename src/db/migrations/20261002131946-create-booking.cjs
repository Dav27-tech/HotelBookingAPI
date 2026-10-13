'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'booking' table
    await queryInterface.createTable(
      'booking',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        guest: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        room: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'room',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        created_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        check_in_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        check_out_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        guests_count: {
          type: Sequelize.SMALLINT,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'booking_status',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        total_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        cancelled_at: {
          type: Sequelize.DATE,
          allowNull: true,
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

    // CHECK constraint: check_out_date must be after check_in_date
    await queryInterface.sequelize.query(
      'ALTER TABLE "booking" ADD CONSTRAINT "chk_booking_dates" CHECK ("check_out_date" > "check_in_date");'
    );

    // CHECK constraint: total_price must be >= 0
    await queryInterface.sequelize.query(
      'ALTER TABLE "booking" ADD CONSTRAINT "chk_booking_total_price" CHECK ("total_price" >= 0)'
    );

    // CHECK constraint: quest_count must be >= 1 and <= 10
    await queryInterface.sequelize.query(
      'ALTER TABLE "booking" ADD CONSTRAINT "chk_booking_guest_count" CHECK ("guests_count" >= 1 AND "guests_count" <= 10)'
    );
  },

  async down(queryInterface, Sequelize) {
    // DOWN - drop the 'booking' table
    await queryInterface.dropTable('booking');
  }
};
