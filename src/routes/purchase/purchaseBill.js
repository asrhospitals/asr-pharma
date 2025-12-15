const express = require('express');
const router = express.Router();
const PurchaseBillController = require('../../controllers/purchase/PurchaseBillController');

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/get-all:
 *   get:
 *     tags:
 *       - Purchase - Bills
 *     summary: Get all purchase bills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase bills
 */
router.get('/v1/get-all', PurchaseBillController.getAllPurchaseBills);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/get/{id}:
 *   get:
 *     tags:
 *       - Purchase - Bills
 *     summary: Get purchase bill by ID
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
 *         description: Purchase bill details
 */
router.get('/v1/get/:id', PurchaseBillController.getPurchaseBillById);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/create:
 *   post:
 *     tags:
 *       - Purchase - Bills
 *     summary: Create purchase bill
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
 *         description: Purchase bill created successfully
 */
router.post('/v1/create', PurchaseBillController.createPurchaseBill);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/update/{id}:
 *   put:
 *     tags:
 *       - Purchase - Bills
 *     summary: Update purchase bill
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
 *         description: Purchase bill updated successfully
 */
router.put('/v1/update/:id', PurchaseBillController.updatePurchaseBill);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/delete/{id}:
 *   delete:
 *     tags:
 *       - Purchase - Bills
 *     summary: Delete purchase bill
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
 *         description: Purchase bill deleted successfully
 */
router.delete('/v1/delete/:id', PurchaseBillController.deletePurchaseBill);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/{id}/record-payment:
 *   post:
 *     tags:
 *       - Purchase - Bills
 *     summary: Record payment
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
 *         description: Payment recorded successfully
 */
router.post('/v1/:id/record-payment', PurchaseBillController.recordPayment);

/**
 * @swagger
 * /pharmacy/admin/purchase/bill/v1/{id}/change-status:
 *   put:
 *     tags:
 *       - Purchase - Bills
 *     summary: Change bill status
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
 *         description: Bill status updated successfully
 */
router.put('/v1/:id/change-status', PurchaseBillController.changeBillStatus);

// Legacy routes for backward compatibility
router.get('/get-bills', PurchaseBillController.getAllPurchaseBills);
router.get('/get-bill/:id', PurchaseBillController.getPurchaseBillById);
router.post('/add-bill', PurchaseBillController.createPurchaseBill);
router.put('/update-bill/:id', PurchaseBillController.updatePurchaseBill);
router.delete('/delete-bill/:id', PurchaseBillController.deletePurchaseBill);

module.exports = router;
