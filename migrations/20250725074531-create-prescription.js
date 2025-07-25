'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      presNo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      presDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id',
        },
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      admissionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      dischargeDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      diagnosis: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      oldHistory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('prescriptions');
  }
};
