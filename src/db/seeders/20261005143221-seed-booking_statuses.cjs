'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO booking_status (name, created_at, updated_at) VALUES
        ('Pending',      NOW(), NOW()),
        ('Confirmed',    NOW(), NOW()),
        ('Checked-in',   NOW(), NOW()),
        ('Checked-out',  NOW(), NOW()),
        ('Cancelled',    NOW(), NOW()),
        ('Now show',     NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('booking_status', {
      name: [
        'Pending',
        'Confirmed',
        'Checked-in',
        'Checked-out',
        'Cancelled',
        'Now show'
      ],
    });
  },
};
