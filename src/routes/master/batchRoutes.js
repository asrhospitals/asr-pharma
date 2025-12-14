const express = require('express');
const router = express.Router();
const BatchController = require('../../controllers/masters/BatchController');

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
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Item not found
 *       409:
 *         description: Batch already exists
 */
router.post('/v1/create', BatchController.createBatch);

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
router.get('/v1/get-all', BatchController.getAllBatches);

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
router.get('/v1/get-by-item/:itemId', BatchController.getBatchesByItem);

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
 *       404:
 *         description: Batch not found
 */
router.get('/v1/get/:id', BatchController.getBatchById);

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
 *       404:
 *         description: Batch not found
 */
router.put('/v1/update-quantity/:id', BatchController.updateBatchQuantity);

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
 *       400:
 *         description: Invalid input or insufficient quantity
 *       404:
 *         description: Batch not found
 */
router.post('/v1/move-quantity', BatchController.moveBatchQuantity);

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
 *       400:
 *         description: Cannot delete batch with remaining quantity
 *       404:
 *         description: Batch not found
 */
router.delete('/v1/delete/:id', BatchController.deleteBatch);

module.exports = router;
