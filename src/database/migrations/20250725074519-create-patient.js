'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
      },
      whatsapp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      patientType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      disease: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      govId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billDiscount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ledger: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bloodgroup: {
        type: Sequelize.STRING,
      },
      maritalstatus: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patients');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_patients_gender";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_patients_status";');
  }
};
