const defineAssociations = (allModels) => {
  const {
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
    SaleMaster,
    PurchaseMaster,
    Batch,
    PurchaseBill,
    PurchaseBillItem,
  } = allModels;

  /**
   * USER ↔ USERCOMPANY (One-to-Many)
   */
  User.hasMany(UserCompany, {
    as: "userCompanies",
    foreignKey: "userId",
  });

  UserCompany.belongsTo(User, {
    as: "user",
    foreignKey: "userId",
  });

  /**
   * USERCOMPANY ↔ COMPANY (One-to-Many)
   */
  UserCompany.hasMany(Company, {
    as: "companies",
    foreignKey: "userCompanyId",
  });

  Company.belongsTo(UserCompany, {
    as: "userCompany",
    foreignKey: "userCompanyId",
  });

  /**
   * USER ↔ ACTIVE COMPANY (single active company at a time)
   */
  // User.belongsTo(Company, {
  //   as: "activeCompany",
  //   foreignKey: "activeCompanyId",
  // });

  /**
   * COMPANY RELATIONS
   */
  Company.hasMany(Item, {
    as: "items",
    foreignKey: "company",
  });

  // Company.hasMany(Group, {
  //   as: "groups",
  //   foreignKey: "companyId",
  // });

  // Item.belongsTo(Company, {
  //   as: "CompanyDetails",
  //   foreignKey: "companyId",
  // });

  // Ledger.belongsTo(Company, {
  //   as: "company",
  //   foreignKey: "companyId",
  // });

  // Group.belongsTo(Company, {
  //   as: "company",
  //   foreignKey: "companyId",
  // });

  /**
   * GROUP ↔ LEDGER
   */
  Group.hasMany(Ledger, {
    as: "ledgers",
    foreignKey: "acgroup",
  });

  Ledger.belongsTo(Group, {
    as: "accountGroup",
    foreignKey: "acgroup",
  });

  Group.hasMany(Group, { as: "subGroups", foreignKey: "parentGroupId" });
  Group.belongsTo(Group, { as: "parentGroup", foreignKey: "parentGroupId" });

  /**
   * SALE MASTER ↔ LEDGERS
   */
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "localSalesLedgerId",
    as: "localSalesLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "centralSalesLedgerId",
    as: "centralSalesLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "igstLedgerId",
    as: "igstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "cgstLedgerId",
    as: "cgstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "sgstLedgerId",
    as: "sgstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  SaleMaster.belongsTo(Ledger, {
    foreignKey: "cessLedgerId",
    as: "cessLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Ledger.hasMany(SaleMaster, {
    foreignKey: "localSalesLedgerId",
    as: "localSales",
  });
  Ledger.hasMany(SaleMaster, {
    foreignKey: "centralSalesLedgerId",
    as: "centralSales",
  });
  Ledger.hasMany(SaleMaster, { foreignKey: "igstLedgerId", as: "igstSales" });
  Ledger.hasMany(SaleMaster, { foreignKey: "cgstLedgerId", as: "cgstSales" });
  Ledger.hasMany(SaleMaster, { foreignKey: "sgstLedgerId", as: "sgstSales" });
  Ledger.hasMany(SaleMaster, { foreignKey: "cessLedgerId", as: "cessSales" });

  /**
   * PURCHASE MASTER ↔ LEDGERS
   */
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "localPurchaseLedgerId",
    as: "localPurchaseLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "centralPurchaseLedgerId",
    as: "centralPurchaseLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "igstLedgerId",
    as: "igstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "cgstLedgerId",
    as: "cgstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "sgstLedgerId",
    as: "sgstLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  PurchaseMaster.belongsTo(Ledger, {
    foreignKey: "cessLedgerId",
    as: "cessLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "localPurchaseLedgerId",
    as: "localPurchases",
  });
  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "centralPurchaseLedgerId",
    as: "centralPurchases",
  });
  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "igstLedgerId",
    as: "igstPurchases",
  });
  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "cgstLedgerId",
    as: "cgstPurchases",
  });
  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "sgstLedgerId",
    as: "sgstPurchases",
  });
  Ledger.hasMany(PurchaseMaster, {
    foreignKey: "cessLedgerId",
    as: "cessPurchases",
  });

  /**
   * ITEM RELATIONS
   */
  Item.belongsTo(Unit, { as: "Unit1", foreignKey: "unit1" });
  Item.belongsTo(Unit, { as: "Unit2", foreignKey: "unit2" });
  Item.belongsTo(HSN, { as: "HsnSacDetail", foreignKey: "hsnsac" });
  Item.belongsTo(Salt, { as: "SaltDetail", foreignKey: "salt" });
  Item.belongsTo(Rack, { as: "RackDetail", foreignKey: "rack" });

  Item.belongsTo(PurchaseMaster, {
    as: "TaxCategoryDetail",
    foreignKey: "taxcategory",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  Item.belongsTo(Company, { as: "CompanyDetails", foreignKey: "company" });

  /**
   * BATCH ↔ ITEM
   */
  Item.hasMany(Batch, {
    foreignKey: "itemId",
    as: "batches",
    onDelete: "CASCADE"
  });

  Batch.belongsTo(Item, {
    foreignKey: "itemId",
    as: "item",
    onDelete: "CASCADE"
  });

  /**
   * BATCH ↔ USERCOMPANY
   */
  UserCompany.hasMany(Batch, {
    foreignKey: "userCompanyId",
    as: "batches",
    onDelete: "CASCADE"
  });

  Batch.belongsTo(UserCompany, {
    foreignKey: "userCompanyId",
    as: "company",
    onDelete: "CASCADE"
  });

  /**
   * SALT ↔ SALT VARIATION
   */
  Salt.hasMany(SaltVariation, {
    foreignKey: "salt_id",
    as: "saltvariations",
  });

  SaltVariation.belongsTo(Salt, {
    foreignKey: "salt_id",
    as: "salt",
  });

  /**
   * RACK ↔ ITEM
   */
  Rack.hasMany(Item, {
    foreignKey: "rack",
    as: "items",
  });

  Rack.belongsTo(Store, { foreignKey: "storeid", as: "store" });

  /**
   * BILL ↔ BILLITEM
   */
  Bill.hasMany(BillItem, {
    foreignKey: "billId",
    as: "billItems",
  });

  BillItem.belongsTo(Bill, {
    foreignKey: "billId",
    as: "bill",
  });

  BillItem.belongsTo(Item, {
    foreignKey: "itemId",
    as: "item",
  });

  /**
   * PURCHASEBILL ↔ PURCHASEBILLITEM
   */
  PurchaseBill.hasMany(PurchaseBillItem, {
    foreignKey: "purchaseBillId",
    as: "billItems",
    onDelete: "CASCADE",
  });

  PurchaseBillItem.belongsTo(PurchaseBill, {
    foreignKey: "purchaseBillId",
    as: "bill",
  });

  PurchaseBillItem.belongsTo(Item, {
    foreignKey: "itemId",
    as: "item",
  });

  PurchaseBillItem.belongsTo(Batch, {
    foreignKey: "batchId",
    as: "batchDetails",
  });

  /**
   * PURCHASEBILL ↔ LEDGER (Supplier)
   */
  PurchaseBill.belongsTo(Ledger, {
    foreignKey: "supplierLedgerId",
    as: "supplierLedger",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  Ledger.hasMany(PurchaseBill, {
    foreignKey: "supplierLedgerId",
    as: "purchaseBills",
  });

  /**
   * PURCHASEBILL ↔ PURCHASEMASTER
   */
  PurchaseBill.belongsTo(PurchaseMaster, {
    foreignKey: "purchaseMasterId",
    as: "purchaseMaster",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  PurchaseMaster.hasMany(PurchaseBill, {
    foreignKey: "purchaseMasterId",
    as: "purchaseBills",
  });

  /**
   * PURCHASEBILL ↔ USERCOMPANY
   */
  PurchaseBill.belongsTo(UserCompany, {
    foreignKey: "userCompanyId",
    as: "company",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });

  UserCompany.hasMany(PurchaseBill, {
    foreignKey: "userCompanyId",
    as: "purchaseBills",
  });
};

module.exports = defineAssociations;
