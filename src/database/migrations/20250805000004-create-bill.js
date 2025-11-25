'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bills', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal("gen_random_uuid()") },
      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "user_companies", key: "id" },
        onDelete: "CASCADE",
      },
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
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bills');
  }
};
