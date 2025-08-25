"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(
      "companies",
      ["userCompanyId", "companyname"],
      {
        unique: true,
        name: "unique_company_per_user_company",
      }
    );

    await queryInterface.addIndex("hsnsac", ["userCompanyId", "hsnSacCode"], {
      unique: true,
      name: "unique_hsnsac_per_user_company",
    });

    await queryInterface.addIndex("units", ["userCompanyId", "unitName"], {
      unique: true,
      name: "unique_unit_per_user_company",
    });

    await queryInterface.addIndex("items", ["userCompanyId", "productname"], {
      unique: true,
      name: "unique_item_per_user_company",
    });

    await queryInterface.addIndex(
      "manufacturers",
      ["userCompanyId", "mfrname"],
      {
        unique: true,
        name: "unique_mfr_per_user_company",
      }
    );

    await queryInterface.addIndex(
      "racks",
      ["userCompanyId", "rackname", "storeid"],
      {
        unique: true,
        name: "unique_rack_per_store_per_user_company",
      }
    );

    await queryInterface.addIndex("salts", ["userCompanyId", "saltname"], {
      unique: true,
      name: "unique_salt_per_user_company",
    });

    await queryInterface.addIndex("stores", ["userCompanyId", "storename"], {
      unique: true,
      name: "unique_store_per_user_company",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      "companies",
      "unique_company_per_user_company"
    );
    await queryInterface.removeIndex(
      "hsnsac",
      "unique_hsnsac_per_user_company"
    );
    await queryInterface.removeIndex("units", "unique_unit_per_user_company");
    await queryInterface.removeIndex("items", "unique_item_per_user_company");
    await queryInterface.removeIndex(
      "manufacturers",
      "unique_mfr_per_user_company"
    );
    await queryInterface.removeIndex(
      "racks",
      "unique_rack_per_store_per_user_company"
    );
    await queryInterface.removeIndex("salts", "unique_salt_per_user_company");
    await queryInterface.removeIndex("stores", "unique_store_per_user_company");
  },
};
