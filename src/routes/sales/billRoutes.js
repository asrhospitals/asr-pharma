const express = require('express');
const router = express.Router();
const BillController = require('../../controllers/sales/BillController');

/**
 * @swagger
 * /pharmacy/sales/bills/v1:
 *   get:
 *     tags:
 *       - Sales - Bills
 *     summary: Get all bills
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bills
 */
router.get('/', BillController.getAllBills);
/**
 * @swagger
 * /pharmacy/sales/bills/v1/{id}:
 *   get:
 *     tags:
 *       - Sales - Bills
 *     summary: Get bill by ID
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
 *         description: Bill details
 *   put:
 *     tags:
 *       - Sales - Bills
 *     summary: Update bill
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
 *         description: Bill updated successfully
 *   delete:
 *     tags:
 *       - Sales - Bills
 *     summary: Delete bill
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
 *         description: Bill deleted successfully
 */
router.get('/:id', BillController.getBillById);

/**
 * @swagger
 * /pharmacy/sales/bills/v1:
 *   post:
 *     tags:
 *       - Sales - Bills
 *     summary: Create bill
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
 *         description: Bill created successfully
 */
router.post('/', BillController.createBill);
router.put('/:id', BillController.updateBill);
router.delete('/:id', BillController.deleteBill);

/**
 * @swagger
 * /pharmacy/sales/bills/v1/{id}/payment:
 *   post:
 *     tags:
 *       - Sales - Bills
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
router.post('/:id/payment', BillController.recordPayment);

/**
 * @swagger
 * /pharmacy/sales/bills/v1/{id}/status:
 *   patch:
 *     tags:
 *       - Sales - Bills
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
router.patch('/:id/status', BillController.changeBillStatus);

// Legacy routes for backward compatibility
router.get('/get-bills', BillController.getAllBills);
router.get('/get-bill/:id', BillController.getBillById);
router.post('/add-bill', BillController.createBill);
router.put('/update-bill/:id', BillController.updateBill);
router.delete('/delete-bill/:id', BillController.deleteBill);

module.exports = router; 
