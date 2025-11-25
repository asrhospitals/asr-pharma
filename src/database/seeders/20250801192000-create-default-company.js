"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if default company already exists
    const [existingCompany] = await queryInterface.sequelize.query(
      'SELECT id FROM user_companies WHERE "companyName" = :companyName LIMIT 1',
      {
        replacements: { companyName: "Default Company" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingCompany) {
      console.log("✓ Default company already exists, skipping creation.");
      return;
    }

    // Get or create default user first
    const [defaultUser] = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE uname = :uname LIMIT 1',
      {
        replacements: { uname: "admin" },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!defaultUser) {
      console.log("⚠ Admin user not found. Please run admin-user seeder first.");
      return;
    }

    // Create default company
    await queryInterface.bulkInsert(
      "user_companies",
      [
        {
          id: Sequelize.Utils.toDefaultValue(Sequelize.UUIDV4()),
          userId: defaultUser.id,
          companyName: "Default Company",
          address: "123 Main Street, Pharmacy District",
          country: "India",
          state: "Gujarat",
          pinCode: "380001",
          branchCode: "MAIN",
          businessType: "Chemist [Pharmacy]",
          calendarType: "English",
          financialYearFrom: new Date("2025-04-01"),
          financialYearTo: new Date("2026-03-31"),
          taxType: "GST",
          status: "active",
          phone: "1234567890",
          email: "company@example.com",
          website: "https://defaultcompany.com",
          logoUrl: "https://defaultcompany.com/logo.png",
          panNumber: "ABCDE1234F",
          isActive: true,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
    );

    console.log("✓ Default company created successfully");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_companies', { companyName: "Default Company" });
  },
};
