'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('doctors', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      userCompanyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "user_companies",
          key: "id",
        },
      },
      mobileNo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      registrationNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hospitalName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
      },
      locationCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pinNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      whatsappNo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
      },
    });

    await queryInterface.addIndex('doctors', ['mobileNo', 'userCompanyId'], {
      unique: true,
      name: 'unique_doctors_mobileNo_userCompanyId'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('doctors');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_doctors_status";');
  }
};
