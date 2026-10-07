"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO user_role (name, created_at, updated_at) VALUES
        ('Administrator',   NOW(), NOW()),
        ('Staff',           NOW(), NOW()),
        ('Guest',           NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("user_role", {
      name: ["Administrator", "Staff", "Guest"],
    });
  },
};
