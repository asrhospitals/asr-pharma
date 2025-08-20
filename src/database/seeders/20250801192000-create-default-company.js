"use strict";


module.exports = {
  async up(queryInterface, Sequelize) {
    // const [company] = await queryInterface.sequelize.query(
    //   'SELECT id FROM companies WHERE "companyName" = :companyName',
    //   {
    //     replacements: { companyName: "Default Company" },
    //     type: Sequelize.QueryTypes.SELECT,
    //   }
    // );

    // if (company) {
    //   console.log("Default company already exists");
    //   return;
    // }

    // const companyId = await queryInterface.bulkInsert(
    //   "companies",
    //   [
    //     {
    //       companyName: "Default Company",
    //       address: "123 Street",
    //       country: "India",
    //       state: "Gujarat",
    //       pinCode: "380001",
    //       branchCode: "MAIN",
    //       businessType: "Chemist [Pharmacy]",
    //       calendarType: "English",
    //       financialYearFrom: new Date("2025-04-01"),
    //       financialYearTo: new Date("2026-03-31"),
    //       taxType: "GST",
    //       status: "active",
    //       phone: "1234567890",
    //       email: "O2NlF@example.com",
    //       website: "https://defaultcompany.com",
    //       logoUrl: "https://defaultcompany.com/logo.png",
    //       panNumber: "ABCDE1234F",
    //       status: "active",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );

    // console.log(`Default company created with ID: ${companyId}`);
  },
  async down(queryInterface, Sequelize) {
    // No down migration needed as this is a default company
    // If you want to remove the company, you can uncomment the following line
    // await queryInterface.bulkDelete('companies', { id: companyId });
  },
};
