'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add unique constraint to the productName column
    await queryInterface.addConstraint('products', {
      fields: ['productName'],
      type: 'unique',
      name: 'unique_productName_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint from the productName column
    await queryInterface.removeConstraint('products', 'unique_productName_constraint');
  }
};
