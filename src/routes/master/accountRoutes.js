const Router = require("express");
const {
  createLedger,
  getLedger,
  getLedgerById,
  updateLedger,
  deleteLedger,
  getLedgerBalance,
  getLedgerTransactions,
  getLedgerDetails,
  updateOpeningBalance,
  getDefaultLedgers,
  getLedgerByCompanyId,
} = require("../../controllers/masters/account/ledger");

const {
  validateCreateLedger,
  validateUpdateLedger,
  validateGetLedgers,
  validateLedgerId,
  validateUpdateOpeningBalance,
  validateGetLedgerBalance,
  validateGetLedgerTransactions,
  handleValidationErrors,
  validateGetLedgerByCompanyId,
} = require("../../middleware/validation/ledgerValidation");

const {
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger,
  canModifyBalance,
} = require("../../middleware/permissions/groupPermissionMiddleware");

const transactionRoutes = require("./transactionRoutes");
const reportRoutes = require("./reportRoutes");
const saleMasterRoutes = require("./saleMasterRoutes");
const purchaseMasterRoutes = require("./purchaseMasterRoutes");
const companyContext = require("../../middleware/default/companyId");

const router = Router();

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/add-ledger:
 *   post:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Create ledger
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
 *         description: Ledger created successfully
 */
router.post(
  "/ledger/v1/add-ledger",
  canCreateLedger,
  validateCreateLedger,
  handleValidationErrors,
  createLedger
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/get-ledger:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get all ledgers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ledgers
 */
router.get(
  "/ledger/v1/get-ledger",
  canViewLedger,
  validateGetLedgers,
  handleValidationErrors,
  getLedger
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/get-ledger/by-companyId/{companyId}:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledgers by company ID
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
 *         description: List of ledgers for company
 */
router.get(
  "/ledger/v1/get-ledger/by-companyId/:companyId",
  canViewLedger,
  validateGetLedgerByCompanyId,
  handleValidationErrors,
  getLedgerByCompanyId
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/get-ledger/{id}:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger by ID
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
 *         description: Ledger details
 */
router.get(
  "/ledger/v1/get-ledger/:id",
  canViewLedger,
  validateLedgerId,
  handleValidationErrors,
  getLedgerById
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/update-ledger/{id}:
 *   put:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Update ledger
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
 *         description: Ledger updated successfully
 */
router.put(
  "/ledger/v1/update-ledger/:id",
  canEditLedger,
  validateUpdateLedger,
  handleValidationErrors,
  updateLedger
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/delete-ledger/{id}:
 *   delete:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Delete ledger
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
 *         description: Ledger deleted successfully
 */
router.delete(
  "/ledger/v1/delete-ledger/:id",
  canDeleteLedger,
  validateLedgerId,
  handleValidationErrors,
  deleteLedger
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/{id}/balance:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger balance
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
 *         description: Ledger balance
 */
router.get(
  "/ledger/v1/:id/balance",
  canViewLedger,
  validateGetLedgerBalance,
  handleValidationErrors,
  getLedgerBalance
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/{id}/transactions:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger transactions
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
 *         description: List of transactions
 */
router.get(
  "/ledger/v1/:id/transactions",
  canViewLedger,
  validateGetLedgerTransactions,
  handleValidationErrors,
  getLedgerTransactions
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/{id}/details:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get ledger details
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
 *         description: Ledger details
 */
router.get(
  "/ledger/v1/:id/details",
  canViewLedger,
  validateGetLedgerTransactions,
  handleValidationErrors,
  getLedgerDetails
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/{id}/opening-balance:
 *   put:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Update opening balance
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
 *         description: Opening balance updated
 */
router.put(
  "/ledger/v1/:id/opening-balance",
  canModifyBalance,
  validateUpdateOpeningBalance,
  handleValidationErrors,
  updateOpeningBalance
);

/**
 * @swagger
 * /pharmacy/admin/master/ledger/v1/default-ledgers:
 *   get:
 *     tags:
 *       - Accounting - Ledgers
 *     summary: Get default ledgers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of default ledgers
 */
router.get("/ledger/v1/default-ledgers", canViewLedger, getDefaultLedgers);

router.use("/", transactionRoutes);

router.use("/", reportRoutes);

router.use("/", saleMasterRoutes);

router.use("/", purchaseMasterRoutes);

module.exports = router;
