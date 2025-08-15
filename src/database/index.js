"use strict";

const { Sequelize } = require("sequelize");
const config = require("../config/config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const User = require("../models/auth/user")(sequelize, Sequelize.DataTypes);
const Company = require("../models/masters/inventory/company")(
  sequelize,
  Sequelize.DataTypes
);
const UserCompany = require("../models/auth/userCompany")(
  sequelize,
  Sequelize.DataTypes
);

const Group = require("../models/masters/accountMaster/group")(
  sequelize,
  Sequelize.DataTypes
);
const GroupPermission =
  require("../models/masters/accountMaster/groupPermission")(
    sequelize,
    Sequelize.DataTypes
  );
const Ledger = require("../models/masters/accountMaster/ledger")(
  sequelize,
  Sequelize.DataTypes
);
const Transaction = require("../models/masters/accountMaster/transaction")(
  sequelize,
  Sequelize.DataTypes
);
const Item = require("../models/masters/inventory/item")(
  sequelize,
  Sequelize.DataTypes
);
const HSN = require("../models/masters/inventory/hsn_sac")(
  sequelize,
  Sequelize.DataTypes
);
const Manufacturer = require("../models/masters/inventory/manufacturer")(
  sequelize,
  Sequelize.DataTypes
);
const Salt = require("../models/masters/inventory/salt")(
  sequelize,
  Sequelize.DataTypes
);
const SaltVariation = require("../models/masters/inventory/salt_variations")(
  sequelize,
  Sequelize.DataTypes
);
const Rack = require("../models/masters/inventory/rack")(
  sequelize,
  Sequelize.DataTypes
);
const Unit = require("../models/masters/inventory/unit")(
  sequelize,
  Sequelize.DataTypes
);
const Store = require("../models/masters/inventory/store")(
  sequelize,
  Sequelize.DataTypes
);
const Doctor = require("../models/masters/other/doctor")(
  sequelize,
  Sequelize.DataTypes
);
const Patient = require("../models/masters/other/patient")(
  sequelize,
  Sequelize.DataTypes
);
const Prescription = require("../models/masters/other/prescription")(
  sequelize,
  Sequelize.DataTypes
);
const PrescriptionItem = require("../models/masters/other/prescription_item")(
  sequelize,
  Sequelize.DataTypes
);
const Bill = require("../models/sales/bill")(sequelize, Sequelize.DataTypes);
const BillItem = require("../models/sales/billItem")(
  sequelize,
  Sequelize.DataTypes
);
const Station = require("../models/masters/other/station")(
  sequelize,
  Sequelize.DataTypes
);
const Otp = require("../models/services/otp")(sequelize, Sequelize.DataTypes);

const defineAssociations = () => {
  User.belongsToMany(Company, {
    through: UserCompany,
    as: "companies",
    foreignKey: "userId",
    otherKey: "companyId",
  });

  Company.belongsToMany(User, {
    through: UserCompany,
    as: "users",
    foreignKey: "companyId",
    otherKey: "userId",
  });

  User.belongsTo(Company, {
    as: "activeCompany",
    foreignKey: "activeCompanyId",
  });

  Company.hasMany(Item, {
    as: "CompanyItems",
    foreignKey: "company",
  });

  Company.hasMany(Ledger, {
    as: "CompanyLedgers",
    foreignKey: "companyId",
  });

  Company.hasMany(Group, {
    as: "CompanyGroups",
    foreignKey: "companyId",
  });

  Item.belongsTo(Company, {
    as: "Company",
    foreignKey: "company",
  });

  Ledger.belongsTo(Company, {
    as: "Company",
    foreignKey: "companyId",
  });

  Group.belongsTo(Company, {
    as: "Company",
    foreignKey: "companyId",
  });

  Group.hasMany(Ledger, {
    as: "GroupLedgers",
    foreignKey: "acgroup",
  });

  Ledger.belongsTo(Group, {
    as: "accountGroup",
    foreignKey: "acgroup",
  });

  Group.hasMany(Group, { as: "subGroups", foreignKey: "parentGroupId" });
  Group.belongsTo(Group, { as: "parentGroup", foreignKey: "parentGroupId" });
};

defineAssociations();

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Company,
  UserCompany,
  Group,
  GroupPermission,
  Ledger,
  Transaction,
  Item,
  HSN,
  Manufacturer,
  Salt,
  SaltVariation,
  Rack,
  Unit,
  Store,
  Doctor,
  Patient,
  Prescription,
  PrescriptionItem,
  Bill,
  BillItem,
  Station,
  Otp,
  defineAssociations,
  testConnection,
};
