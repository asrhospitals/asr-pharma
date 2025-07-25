const express = require('express');
const router = express.Router();
const BillController = require('../../controller/sales/BillController');

router.get('/get-bills', BillController.getAllBills);
router.get('/get-bill/:id', BillController.getBillById);
router.post('/add-bill', BillController.createBill);
router.put('/update-bill/:id', BillController.updateBill);
router.delete('/delete-bill/:id', BillController.deleteBill);

module.exports = router; 
