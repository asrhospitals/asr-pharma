const express = require('express');
const router = express.Router();
const BillController = require('../../controllers/sales/BillController');

// Bill CRUD operations
router.get('/', BillController.getAllBills);
router.get('/:id', BillController.getBillById);
router.post('/', BillController.createBill);
router.put('/:id', BillController.updateBill);
router.delete('/:id', BillController.deleteBill);

// Bill-specific operations
router.post('/:id/payment', BillController.recordPayment);
router.patch('/:id/status', BillController.changeBillStatus);

// Legacy routes for backward compatibility
router.get('/get-bills', BillController.getAllBills);
router.get('/get-bill/:id', BillController.getBillById);
router.post('/add-bill', BillController.createBill);
router.put('/update-bill/:id', BillController.updateBill);
router.delete('/delete-bill/:id', BillController.deleteBill);

module.exports = router; 
