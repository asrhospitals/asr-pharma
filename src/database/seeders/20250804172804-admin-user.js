"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const isUserExists = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM users WHERE uname = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (isUserExists[0].count > 0) {
      console.log("✓ Admin user already exists, skipping creation.");
      return;
    }

    const hashedPwd = await bcrypt.hash("Admin@123", 12);

    await queryInterface.bulkInsert("users", [
      {
        id: Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4()),
        uname: "admin",
        pwd: hashedPwd,
        role: "admin",
        module: ["all"],
        fname: "Admin",
        lname: "User",
        email: "admin@example.com",
        phone: "1111111111",
        pin: "123456",
        isactive: "active",
        phoneVerified: true,
        emailVerified: true,
        phoneVerificationCode: "000000",
        phoneVerificationExpiry: new Date(Date.now() + 1000 * 60 * 5),
        emailVerificationCode: "000000",
        emailVerificationExpiry: new Date(Date.now() + 1000 * 60 * 5),
        activeCompanyId: null,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✓ Admin user created successfully (username: admin, password: Admin@123)");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { uname: "admin" });
  },
};
