const express = require('express');
const router = express.Router();
const PurchaseBillController = require('../../controllers/purchase/PurchaseBillController');

// Purchase Bill CRUD operations
router.get('/v1/get-all', PurchaseBillController.getAllPurchaseBills);
router.get('/v1/get/:id', PurchaseBillController.getPurchaseBillById);
router.post('/v1/create', PurchaseBillController.createPurchaseBill);
router.put('/v1/update/:id', PurchaseBillController.updatePurchaseBill);
router.delete('/v1/delete/:id', PurchaseBillController.deletePurchaseBill);

// Purchase Bill-specific operations
router.post('/v1/:id/record-payment', PurchaseBillController.recordPayment);
router.put('/v1/:id/change-status', PurchaseBillController.changeBillStatus);

// Legacy routes for backward compatibility
router.get('/get-bills', PurchaseBillController.getAllPurchaseBills);
router.get('/get-bill/:id', PurchaseBillController.getPurchaseBillById);
router.post('/add-bill', PurchaseBillController.createPurchaseBill);
router.put('/update-bill/:id', PurchaseBillController.updatePurchaseBill);
router.delete('/delete-bill/:id', PurchaseBillController.deletePurchaseBill);

module.exports = router;
