"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO room_status (name, created_at, updated_at) VALUES
        ('Available',       NOW(), NOW()),
        ('Reserved',        NOW(), NOW()),
        ('Occupied',        NOW(), NOW()),
        ('Cleaning',        NOW(), NOW()),
        ('Maintenance',     NOW(), NOW()),
        ('Out of service',  NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("room_status", {
      name: [
        "Available",
        "Reserved",
        "Occupied",
        "Cleaning",
        "Maintenance",
        "Out of service",
      ],
    });
  },
};
