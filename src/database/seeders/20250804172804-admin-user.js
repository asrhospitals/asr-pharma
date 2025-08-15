"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const existingAdmin = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM users WHERE uname = :uname",
      {
        replacements: { uname: "admin" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingAdmin[0].count > 0) {
      console.log("Admin user already exists, skipping creation.");
      return;
    }

    const [company] = await queryInterface.sequelize.query(
      'SELECT id FROM companies WHERE "companyName" = :companyName',
      {
        replacements: { companyName: "Default Company" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!company) {
      throw new Error("Default company not found");
    }
    const companyId = company.id;

    const hashedPwd = await bcrypt.hash("admin123", 12);
    await queryInterface.bulkInsert("users", [
      {
        uname: "admin",
        pwd: hashedPwd,
        role: "admin",
        module: ["all"],
        fname: "Admin",
        lname: "Admin",
        isactive: "active",
        email: "admin@asrpharma.com",
        phone: "9876543210",
        pin: "123456",
        phoneVerified: true,
        emailVerified: true,
        phoneVerificationCode: "123456",
        phoneVerificationExpiry: new Date(Date.now() + 1000 * 60 * 5),
        emailVerificationCode: "123456",
        emailVerificationExpiry: new Date(Date.now() + 1000 * 60 * 5),
        activeCompanyId: companyId,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Admin user created successfully.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { uname: "admin" });
  },
};
