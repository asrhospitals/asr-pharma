"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove unique constraints directly on columns (if they exist)
    // await queryInterface.changeColumn("user_companies", "branchCode", {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });

    // await queryInterface.changeColumn("user_companies", "companyName", {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    // });

    // await queryInterface.addIndex("user_companies", ["branchCode", "userId"], {
    //   unique: true,
    //   name: "unique_branch_code_user",
    // });

    // await queryInterface.addIndex("user_companies", ["companyName", "userId"], {
    //   unique: true,
    //   name: "unique_company_name_user",
    // });
  },

  async down(queryInterface, Sequelize) {
    // Drop composite indexes
    // await queryInterface.removeIndex("user_companies", "unique_branch_code_user");
    // await queryInterface.removeIndex("user_companies", "unique_company_name_user");

    // // Restore uniqueness on individual columns if needed
    // await queryInterface.changeColumn("user_companies", "branchCode", {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   unique: true,
    // });

    // await queryInterface.changeColumn("user_companies", "companyName", {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   unique: true,
    // });

  },
};
