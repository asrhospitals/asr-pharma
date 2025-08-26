"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("doctors", "userCompanyId", {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "user_companies",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    // await queryInterface.addColumn("patients", "userCompanyId", {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "user_companies",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    // await queryInterface.addColumn("prescriptions", "userCompanyId", {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "user_companies",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });

    // await queryInterface.addColumn("stations", "userCompanyId", {
    //   type: Sequelize.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "user_companies",
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });


    // add index as well
    // await queryInterface.addIndex("doctors", ["mobileNo", "userCompanyId"], {
    //   unique: true,
    //   name: "unique_doctors_mobileNo_userCompanyId",
    // });

    // await queryInterface.addIndex('patients', ['userCompanyId', 'name'], {
    //   unique: true,
    //   name: 'unique_userCompanyId_patient_name'
    // });

    // await queryInterface.addIndex('prescriptions', ['userCompanyId', 'presNo'], {
    //   unique: true,
    //   name: 'unique_userCompanyId_presNo'
    // });

    // await queryInterface.addIndex('stations', ['userCompanyId', 'name'], {
    //   unique: true,
    //   name: 'unique_userCompanyId_station_name'
    // });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("doctors", "userCompanyId");
    await queryInterface.removeColumn("patients", "userCompanyId");
    await queryInterface.removeColumn("prescriptions", "userCompanyId");
    await queryInterface.removeColumn("stations", "userCompanyId");
  },
};
