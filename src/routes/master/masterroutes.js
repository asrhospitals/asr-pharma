const express = require("express");
const router = express.Router();

const ItemController = require("../../controllers/masters/inventory/Item");
const StoreController = require("../../controllers/masters/inventory/Store");
const RackController = require("../../controllers/masters/inventory/Rack");
const CompanyController = require("../../controllers/masters/inventory/Company");
const UserCompanyController = require('../../controllers/auth/userCompany')
const SaltController = require("../../controllers/masters/inventory/Salt");
const HSNController = require("../../controllers/masters/inventory/HSN");
const UnitController = require("../../controllers/masters/inventory/Unit");
const ManufacturerController = require("../../controllers/masters/inventory/Manufacturer");
const SaltVariationController = require("../../controllers/masters/inventory/SaltVariation");
const PatientController = require("../../controllers/masters/other/Patient");
const DoctorController = require("../../controllers/masters/other/Doctor");
const PrescriptionController = require("../../controllers/masters/other/Prescription");
const StationController = require("../../controllers/masters/other/Station");
const BillController = require("../../controllers/sales/BillController");
const { verifyToken } = require("../../middleware/security");
const GroupController = require("../../controllers/masters/account/group");
const BatchController = require("../../controllers/masters/BatchController");


const {
  canEditGroup,
  canDeleteGroup,
  canCreateGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
} = require("../../middleware/permissions/groupPermissionMiddleware");

/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/add-item:
 *   post:
 *     tags:
 *       - Inventory - Items
 *     summary: Create item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *               itemCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created successfully
 */
router.post("/inventory/item/v1/add-item", ItemController.createItem);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/get-item:
 *   get:
 *     tags:
 *       - Inventory - Items
 *     summary: Get all items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items
 */
router.get("/inventory/item/v1/get-item", ItemController.getItems);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/get-items/{id}:
 *   get:
 *     tags:
 *       - Inventory - Items
 *     summary: Get item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item details
 */
router.get("/inventory/item/v1/get-items/:id", ItemController.getItemById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/update-item/{id}:
 *   put:
 *     tags:
 *       - Inventory - Items
 *     summary: Update item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
router.put("/inventory/item/v1/update-item/:id", ItemController.updateItem);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/item/v1/delete-item/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Items
 *     summary: Delete item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
router.delete("/inventory/item/v1/delete-item/:id", ItemController.deleteItem);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/add-store:
 *   post:
 *     tags:
 *       - Inventory - Stores
 *     summary: Create store
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 */
router.post("/inventory/store/v1/add-store", StoreController.createStore);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/get-store:
 *   get:
 *     tags:
 *       - Inventory - Stores
 *     summary: Get all stores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 */
router.get("/inventory/store/v1/get-store", StoreController.getStores);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/get-stores/{id}:
 *   get:
 *     tags:
 *       - Inventory - Stores
 *     summary: Get store by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store details
 */
router.get("/inventory/store/v1/get-stores/:id", StoreController.getStoreById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/update-store/{id}:
 *   put:
 *     tags:
 *       - Inventory - Stores
 *     summary: Update store
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Store updated successfully
 */
router.put("/inventory/store/v1/update-store/:id", StoreController.updateStore);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/store/v1/delete-store/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Stores
 *     summary: Delete store
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store deleted successfully
 */
router.delete("/inventory/store/v1/delete-store/:id", StoreController.deleteStore);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/rack/v1/add-rack:
 *   post:
 *     tags:
 *       - Inventory - Racks
 *     summary: Create rack
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Rack created successfully
 */
router.post("/inventory/rack/v1/add-rack", RackController.createRack);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/rack/v1/get-rack:
 *   get:
 *     tags:
 *       - Inventory - Racks
 *     summary: Get all racks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of racks
 */
router.get("/inventory/rack/v1/get-rack", RackController.getRacks);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/rack/v1/get-racks/{id}:
 *   get:
 *     tags:
 *       - Inventory - Racks
 *     summary: Get rack by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rack details
 */
router.get("/inventory/rack/v1/get-racks/:id", RackController.getRackId);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/rack/v1/update-rack/{id}:
 *   put:
 *     tags:
 *       - Inventory - Racks
 *     summary: Update rack
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Rack updated successfully
 */
router.put("/inventory/rack/v1/update-rack/:id", RackController.updateRack);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/rack/v1/delete-rack/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Racks
 *     summary: Delete rack
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rack deleted successfully
 */
router.delete("/inventory/rack/v1/delete-rack/:id", RackController.deleteRack);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/company/v1/add-company:
 *   post:
 *     tags:
 *       - Inventory - Companies
 *     summary: Create company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.post("/inventory/company/v1/add-company", verifyToken, CompanyController.createCompany);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/company/v1/get-companies:
 *   get:
 *     tags:
 *       - Inventory - Companies
 *     summary: Get all companies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get("/inventory/company/v1/get-companies", verifyToken, CompanyController.getAllCompanies);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/company/v1/get-company/{id}:
 *   get:
 *     tags:
 *       - Inventory - Companies
 *     summary: Get company by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company details
 */
router.get("/inventory/company/v1/get-company/:id", verifyToken, CompanyController.getCompanyById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/company/v1/update-company/{id}:
 *   put:
 *     tags:
 *       - Inventory - Companies
 *     summary: Update company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Company updated successfully
 */
router.put("/inventory/company/v1/update-company/:id", verifyToken, CompanyController.updateCompany);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/company/v1/delete-company/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Companies
 *     summary: Delete company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 */
router.delete("/inventory/company/v1/delete-company/:id", verifyToken, CompanyController.deleteCompany);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/get-UserCompanies/{userId}:
 *   get:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Get user companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user companies
 */
router.get("/inventory/userCompany/v1/get-UserCompanies/:userId", verifyToken, UserCompanyController.getUserCompanies);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/get-UserCompany/{companyId}:
 *   get:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Get user company by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User company details
 */
router.get("/inventory/userCompany/v1/get-UserCompany/:companyId", verifyToken, UserCompanyController.getCompanyById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/add-UserCompanies/{userId}:
 *   post:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Create user company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User company created successfully
 */
router.post("/inventory/userCompany/v1/add-UserCompanies/:userId", verifyToken, UserCompanyController.createUserCompany);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/update-UserCompany/{id}/{userId}:
 *   put:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Update user company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User company updated successfully
 */
router.put("/inventory/userCompany/v1/update-UserCompany/:id/:userId", verifyToken, UserCompanyController.updateUserCompany);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/{companyId}/delete-UserCompany/{userId}:
 *   delete:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Delete user company
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User company deleted successfully
 */
router.delete("/inventory/userCompany/v1/:companyId/delete-UserCompany/:userId", verifyToken, UserCompanyController.deleteCompany);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/userCompany/v1/get-all-user-companies:
 *   get:
 *     tags:
 *       - Inventory - User Companies
 *     summary: Get all user companies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all user companies
 */
router.get("/inventory/userCompany/v1/get-all-user-companies", verifyToken, UserCompanyController.getAllCompanies);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/salt/v1/add-salt:
 *   post:
 *     tags:
 *       - Inventory - Salts
 *     summary: Create salt
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Salt created successfully
 */
router.post("/inventory/salt/v1/add-salt", SaltController.createSalt);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/salt/v1/get-salt:
 *   get:
 *     tags:
 *       - Inventory - Salts
 *     summary: Get all salts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of salts
 */
router.get("/inventory/salt/v1/get-salt", SaltController.getSalt);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/salt/v1/get-salts/{id}:
 *   get:
 *     tags:
 *       - Inventory - Salts
 *     summary: Get salt by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salt details
 */
router.get("/inventory/salt/v1/get-salts/:id", SaltController.getSaltById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/salt/v1/update-salt/{id}:
 *   put:
 *     tags:
 *       - Inventory - Salts
 *     summary: Update salt
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Salt updated successfully
 */
router.put("/inventory/salt/v1/update-salt/:id", SaltController.updateSalt);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/salt/v1/delete-salt/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Salts
 *     summary: Delete salt
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Salt deleted successfully
 */
router.delete("/inventory/salt/v1/delete-salt/:id", SaltController.deleteSalt);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/hsn/v1/add-hsn:
 *   post:
 *     tags:
 *       - Inventory - HSN/SAC
 *     summary: Create HSN/SAC
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: HSN/SAC created successfully
 */
router.post("/inventory/hsn/v1/add-hsn", HSNController.addHSN);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/hsn/v1/get-hsn:
 *   get:
 *     tags:
 *       - Inventory - HSN/SAC
 *     summary: Get all HSN/SAC
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of HSN/SAC
 */
router.get("/inventory/hsn/v1/get-hsn", HSNController.getAllHSN);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/hsn/v1/get-hsns/{id}:
 *   get:
 *     tags:
 *       - Inventory - HSN/SAC
 *     summary: Get HSN/SAC by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HSN/SAC details
 */
router.get("/inventory/hsn/v1/get-hsns/:id", HSNController.getHSNById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/hsn/v1/update-hsn/{id}:
 *   put:
 *     tags:
 *       - Inventory - HSN/SAC
 *     summary: Update HSN/SAC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: HSN/SAC updated successfully
 */
router.put("/inventory/hsn/v1/update-hsn/:id", HSNController.updateHSN);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/hsn/v1/delete-hsn/{id}:
 *   delete:
 *     tags:
 *       - Inventory - HSN/SAC
 *     summary: Delete HSN/SAC
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: HSN/SAC deleted successfully
 */
router.delete("/inventory/hsn/v1/delete-hsn/:id", HSNController.deleteHSN);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/unit/v1/add-unit:
 *   post:
 *     tags:
 *       - Inventory - Units
 *     summary: Create unit
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Unit created successfully
 */
router.post("/inventory/unit/v1/add-unit", UnitController.addUnit);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/unit/v1/get-unit:
 *   get:
 *     tags:
 *       - Inventory - Units
 *     summary: Get all units
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of units
 */
router.get("/inventory/unit/v1/get-unit", UnitController.getAllUnits);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/unit/v1/get-units/{id}:
 *   get:
 *     tags:
 *       - Inventory - Units
 *     summary: Get unit by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit details
 */
router.get("/inventory/unit/v1/get-units/:id", UnitController.getUnitById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/unit/v1/update-unit/{id}:
 *   put:
 *     tags:
 *       - Inventory - Units
 *     summary: Update unit
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Unit updated successfully
 */
router.put("/inventory/unit/v1/update-unit/:id", UnitController.updateUnit);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/unit/v1/delete-unit/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Units
 *     summary: Delete unit
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 */
router.delete("/inventory/unit/v1/delete-unit/:id", UnitController.deleteUnit);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/manu/v1/add-manufacturer:
 *   post:
 *     tags:
 *       - Inventory - Manufacturers
 *     summary: Create manufacturer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Manufacturer created successfully
 */
router.post("/inventory/manu/v1/add-manufacturer", ManufacturerController.addManufacturer);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/manu/v1/get-manufacturer:
 *   get:
 *     tags:
 *       - Inventory - Manufacturers
 *     summary: Get all manufacturers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of manufacturers
 */
router.get("/inventory/manu/v1/get-manufacturer", ManufacturerController.getAllManufacturers);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/manu/v1/get-manu/{id}:
 *   get:
 *     tags:
 *       - Inventory - Manufacturers
 *     summary: Get manufacturer by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Manufacturer details
 */
router.get("/inventory/manu/v1/get-manu/:id", ManufacturerController.getManuById);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/manu/v1/update-manufacturer/{id}:
 *   put:
 *     tags:
 *       - Inventory - Manufacturers
 *     summary: Update manufacturer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Manufacturer updated successfully
 */
router.put("/inventory/manu/v1/update-manufacturer/:id", ManufacturerController.updateManufacturer);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/manu/v1/delete-manufacturer/{id}:
 *   delete:
 *     tags:
 *       - Inventory - Manufacturers
 *     summary: Delete manufacturer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Manufacturer deleted successfully
 */
router.delete("/inventory/manu/v1/delete-manufacturer/:id", ManufacturerController.deleteManufacturer);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/saltv/v1/add-saltv:
 *   post:
 *     tags:
 *       - Inventory - Salt Variations
 *     summary: Create salt variation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Salt variation created successfully
 */
router.post("/inventory/saltv/v1/add-saltv", SaltVariationController.addVariations);
/**
 * @swagger
 * /pharmacy/admin/master/inventory/saltv/v1/get-saltv:
 *   get:
 *     tags:
 *       - Inventory - Salt Variations
 *     summary: Get all salt variations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of salt variations
 */
router.get("/inventory/saltv/v1/get-saltv", SaltVariationController.getVariations);

/**
 * @swagger
 * /pharmacy/admin/master/inventory/saltv/v1/update-saltv:
 *   put:
 *     tags:
 *       - Inventory - Salt Variations
 *     summary: Update salt variation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Salt variation updated successfully
 */
router.put("/inventory/saltv/v1/update-saltv", SaltVariationController.updateVariation);

/**
 * @swagger
 * /pharmacy/admin/master/other/patient/v1/add-patient:
 *   post:
 *     tags:
 *       - Masters - Patients
 *     summary: Create patient
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post("/other/patient/v1/add-patient", PatientController.createPatient);
/**
 * @swagger
 * /pharmacy/admin/master/other/patient/v1/get-patient:
 *   get:
 *     tags:
 *       - Masters - Patients
 *     summary: Get all patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get("/other/patient/v1/get-patient", PatientController.getAllPatients);

/**
 * @swagger
 * /pharmacy/admin/master/other/patient/v1/get-patients/{id}:
 *   get:
 *     tags:
 *       - Masters - Patients
 *     summary: Get patient by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient details
 */
router.get("/other/patient/v1/get-patients/:id", PatientController.getPatientById);

/**
 * @swagger
 * /pharmacy/admin/master/other/patient/v1/update-patient/{id}:
 *   put:
 *     tags:
 *       - Masters - Patients
 *     summary: Update patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put("/other/patient/v1/update-patient/:id", PatientController.updatePatient);

/**
 * @swagger
 * /pharmacy/admin/master/other/patient/v1/delete-patient/{id}:
 *   delete:
 *     tags:
 *       - Masters - Patients
 *     summary: Delete patient
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
router.delete("/other/patient/v1/delete-patient/:id", PatientController.deletePatient);

/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/add-doctor:
 *   post:
 *     tags:
 *       - Masters - Doctors
 *     summary: Create doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Doctor created successfully
 */
router.post("/other/doctor/v1/add-doctor", DoctorController.createDoctor);
/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/get-doctor:
 *   get:
 *     tags:
 *       - Masters - Doctors
 *     summary: Get all doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get("/other/doctor/v1/get-doctor", DoctorController.getDoctors);

/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/get-doctors/{id}:
 *   get:
 *     tags:
 *       - Masters - Doctors
 *     summary: Get doctor by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor details
 */
router.get("/other/doctor/v1/get-doctors/:id", DoctorController.getDoctorById);

/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/update-doctor/{id}:
 *   put:
 *     tags:
 *       - Masters - Doctors
 *     summary: Update doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 */
router.put("/other/doctor/v1/update-doctor/:id", DoctorController.updateDoctor);

/**
 * @swagger
 * /pharmacy/admin/master/other/doctor/v1/delete-doctor/{id}:
 *   delete:
 *     tags:
 *       - Masters - Doctors
 *     summary: Delete doctor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */
router.delete("/other/doctor/v1/delete-doctor/:id", DoctorController.deleteDoctor);

/**
 * @swagger
 * /pharmacy/admin/master/other/prescription/v1/add-prescription:
 *   post:
 *     tags:
 *       - Masters - Prescriptions
 *     summary: Create prescription
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Prescription created successfully
 */
router.post("/other/prescription/v1/add-prescription", PrescriptionController.createPrescription);
/**
 * @swagger
 * /pharmacy/admin/master/other/prescription/v1/get-prescription:
 *   get:
 *     tags:
 *       - Masters - Prescriptions
 *     summary: Get all prescriptions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of prescriptions
 */
router.get("/other/prescription/v1/get-prescription", PrescriptionController.getPrescriptions);

/**
 * @swagger
 * /pharmacy/admin/master/other/prescription/v1/get-prescriptions/{id}:
 *   get:
 *     tags:
 *       - Masters - Prescriptions
 *     summary: Get prescription by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription details
 */
router.get("/other/prescription/v1/get-prescriptions/:id", PrescriptionController.getPrescriptionById);

/**
 * @swagger
 * /pharmacy/admin/master/other/prescription/v1/update-prescription/{id}:
 *   put:
 *     tags:
 *       - Masters - Prescriptions
 *     summary: Update prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 */
router.put("/other/prescription/v1/update-prescription/:id", PrescriptionController.updatePrescription);

/**
 * @swagger
 * /pharmacy/admin/master/other/prescription/v1/delete-prescription/{id}:
 *   delete:
 *     tags:
 *       - Masters - Prescriptions
 *     summary: Delete prescription
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 */
router.delete("/other/prescription/v1/delete-prescription/:id", PrescriptionController.deletePrescription);

/**
 * @swagger
 * /pharmacy/admin/master/other/station/v1/add-station:
 *   post:
 *     tags:
 *       - Masters - Stations
 *     summary: Create station
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Station created successfully
 */
router.post("/other/station/v1/add-station", StationController.createStation);
/**
 * @swagger
 * /pharmacy/admin/master/other/station/v1/get-station:
 *   get:
 *     tags:
 *       - Masters - Stations
 *     summary: Get all stations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stations
 */
router.get("/other/station/v1/get-station", StationController.getStations);

/**
 * @swagger
 * /pharmacy/admin/master/other/station/v1/get-stations/{id}:
 *   get:
 *     tags:
 *       - Masters - Stations
 *     summary: Get station by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station details
 */
router.get("/other/station/v1/get-stations/:id", StationController.getStationById);

/**
 * @swagger
 * /pharmacy/admin/master/other/station/v1/update-station/{id}:
 *   put:
 *     tags:
 *       - Masters - Stations
 *     summary: Update station
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Station updated successfully
 */
router.put("/other/station/v1/update-station/:id", StationController.updateStation);

/**
 * @swagger
 * /pharmacy/admin/master/other/station/v1/delete-station/{id}:
 *   delete:
 *     tags:
 *       - Masters - Stations
 *     summary: Delete station
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station deleted successfully
 */
router.delete("/other/station/v1/delete-station/:id", StationController.deleteStation);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/create:
 *   post:
 *     tags:
 *       - Master - Batch
 *     summary: Create a new batch for an item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *               - batchNumber
 *               - quantity
 *             properties:
 *               itemId:
 *                 type: string
 *                 format: uuid
 *               batchNumber:
 *                 type: string
 *               quantity:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date
 *               mrp:
 *                 type: number
 *               purchaseRate:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Batch created successfully
 */
router.post("/batch/v1/create", BatchController.createBatch);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/get-all:
 *   get:
 *     tags:
 *       - Master - Batch
 *     summary: Get all batches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [Active, Inactive, Expired]
 *     responses:
 *       200:
 *         description: List of batches
 */
router.get("/batch/v1/get-all", BatchController.getAllBatches);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/get-by-item/{itemId}:
 *   get:
 *     tags:
 *       - Master - Batch
 *     summary: Get all batches for a specific item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of batches for the item
 */
router.get("/batch/v1/get-by-item/:itemId", BatchController.getBatchesByItem);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/get/{id}:
 *   get:
 *     tags:
 *       - Master - Batch
 *     summary: Get batch by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Batch details
 */
router.get("/batch/v1/get/:id", BatchController.getBatchById);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/update-quantity/{id}:
 *   put:
 *     tags:
 *       - Master - Batch
 *     summary: Update batch quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Batch quantity updated successfully
 */
router.put("/batch/v1/update-quantity/:id", BatchController.updateBatchQuantity);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/move-quantity:
 *   post:
 *     tags:
 *       - Master - Batch
 *     summary: Move quantity from one batch to another
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromBatchId
 *               - toBatchId
 *               - quantity
 *             properties:
 *               fromBatchId:
 *                 type: string
 *                 format: uuid
 *               toBatchId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quantity moved successfully
 */
router.post("/batch/v1/move-quantity", BatchController.moveBatchQuantity);

/**
 * @swagger
 * /pharmacy/admin/master/batch/v1/delete/{id}:
 *   delete:
 *     tags:
 *       - Master - Batch
 *     summary: Delete batch
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 */
router.delete("/batch/v1/delete/:id", BatchController.deleteBatch);

// router.post("/groups", canCreateGroup, GroupController.createGroup);
// router.get("/groups", GroupController.getAllGroups);
// router.get("/groups/hierarchy", GroupController.getGroupHierarchy);
// router.get("/groups/accessible", GroupController.getAllGroups);
// router.get("/groups/type/:type", GroupController.getGroupsByType);
// router.get("/groups/parent/:parentId", GroupController.getGroupsByParent);
// router.get("/groups/available-parents", GroupController.getAvailableParents);
// router.get("/groups/:id", GroupController.getGroupById);
// router.put("/groups/:id", canEditGroup, GroupController.updateGroup);
// router.delete("/groups/:id", canDeleteGroup, GroupController.deleteGroup);

// router.get("/groups/:id/permissions", GroupController.getGroupPermissions);
// router.post("/groups/:id/permissions", GroupController.setGroupPermission);

module.exports = router;
