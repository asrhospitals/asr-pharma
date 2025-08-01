'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bills', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      billNo: { type: Sequelize.STRING, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      partyName: { type: Sequelize.STRING },
      patientId: { type: Sequelize.STRING },
      patientName: { type: Sequelize.STRING },
      doctorId: { type: Sequelize.STRING },
      doctorName: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10, 2) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bills');
  }
};
