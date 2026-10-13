'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // UP - create the 'payment' table\
    await queryInterface.createTable(
      'payment',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        booking: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'booking',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        method: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'payment_method',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'payment_status',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        paid_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        processed_by: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'user',
            key: 'id',
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
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

    // CHECK constraint: amount must be >= 0
    await queryInterface.sequelize.query(
      'ALTER TABLE "payment" ADD CONSTRAINT "chk_payment_amount" CHECK ("amount" >= 0)'
    );
  },

  async down(queryInterface, Sequelize) {
    // DOWN - drop the 'payment' table
    await queryInterface.createTable('payment');
  }
};
