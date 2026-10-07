"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO room_type
        (
          name,
          description,
          price_per_night,
          max_occupancy,
          amenities,
          created_at,
          updated_at
        )
      VALUES
        (
          'Standard',
          'Comfortable room with one queen bed, ideal for solo travelers or couples.',
          80.00,
          2,
          '["wifi","tv","ac","private_bathroom"]'::jsonb,
          NOW(),
          NOW()
        ),
        (
          'Double',
          'Spacious room with two double beds, perfect for friends or small families.',
          120.00,
          4,
          '["wifi","tv","ac","private_bathroom","minibar"]'::jsonb,
          NOW(),
          NOW()
        ),
        (
          'Deluxe',
          'Premium room with king bed, city view, and upgraded amenities.',
          180.00,
          2,
          '["wifi","tv","ac","private_bathroom","minibar","city_view","workspace"]'::jsonb,
          NOW(),
          NOW()
        ),
        (
          'Family',
          'Large room with one king and two single beds, designed for families.',
          220.00,
          6,
          '["wifi","tv","ac","private_bathroom","minibar","sofa_bed","kids_area"]'::jsonb,
          NOW(),
          NOW()
        ),
        (
          'Executive Suite',
          'Two-room suite with living area, kitchenette, and panoramic view.',
          350.00,
          4,
          '["wifi","tv","ac","private_bathroom","minibar","kitchenette","living_room","panoramic_view","workspace","jacuzzi"]'::jsonb,
          NOW(),
          NOW()
        )
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("room_type", {
      name: ["Standard", "Double", "Deluxe", "Family", "Executive Suite"],
    });
  },
};
