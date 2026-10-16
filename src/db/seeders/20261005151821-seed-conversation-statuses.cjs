'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO conversation_status (name, created_at, updated_at) VALUES
        ('Open',     NOW(), NOW()),
        ('Assigned', NOW(), NOW()),
        ('Closed',   NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('conversation_status', {
      name: ['Open', 'Assigned', 'Closed'],
    });
  },
};
