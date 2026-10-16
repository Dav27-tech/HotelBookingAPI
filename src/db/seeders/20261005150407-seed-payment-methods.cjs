'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO payment_method (name, created_at, updated_at) VALUES
        ('Credit card',     NOW(), NOW()),
        ('Debit card',      NOW(), NOW()),
        ('Cash',            NOW(), NOW()),
        ('Bank transfer',   NOW(), NOW()),
        ('Paypal',          NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payment_method', {
      name: [
        'Credit card',
        'Debit card',
        'Cash',
        'Bank transfer',
        'Paypal'
      ],
    });
  },
};
