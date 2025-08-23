"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .removeIndex("sale_masters", "sale_masters_salesType_unique")
      .catch(() => {
        console.log("Index sale_masters_salesType_key not found, skipping...");
      });

    await queryInterface.addIndex(
      "sale_masters",
      ["companyId", "salesType"],
      {
        unique: true,
        name: "unique_sales_type_per_company",
      }
    );

    await queryInterface
      .removeIndex("purchase_masters", "purchase_masters_purchase_type")
      .catch(() => {
        console.log(
          "Index purchase_masters_purchaseType_key not found, skipping..."
        );
      });

    await queryInterface.addIndex(
      "purchase_masters",
      ["companyId", "purchaseType"],
      {
        unique: true,
        name: "unique_purchase_type_per_company",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "sale_masters",
      "unique_sales_type_per_company"
    );
    await queryInterface.addIndex("sale_masters", ["salesType"], {
      unique: true,
      name: "sale_masters_salesType_key",
    });

    await queryInterface.removeIndex(
      "purchase_masters",
      "unique_purchase_type_per_company"
    );
    await queryInterface.addIndex("purchase_masters", ["purchaseType"], {
      unique: true,
      name: "purchase_masters_purchaseType_key",
    });
  },
};
