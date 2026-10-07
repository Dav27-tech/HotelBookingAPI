"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO user_status (name, created_at, updated_at) VALUES
        ('Active',     NOW(), NOW()),
        ('Inactive',   NOW(), NOW()),
        ('Suspended',  NOW(), NOW()),
        ('Deleted',    NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_status", {
      name: ["Active", "Inactive", "Suspended", "Deleted"],
    });
  },
};
