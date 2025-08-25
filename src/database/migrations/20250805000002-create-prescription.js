'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('prescriptions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
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
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
      },
      doctorId: {
        type: Sequelize.UUID,
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
