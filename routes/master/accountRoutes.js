const Router=require('express');
const { createLedger, getLedger, getLedgerById, updateLedger, deleteLedger } = require('../../controller/masters/account/ledger');
const router=Router();

//-------------------------------------Ledger Master----------------------------------//

// Ledger routes - matching frontend /ledger/v1/ pattern
router.post('/ledger/v1/add-ledger', createLedger);
router.get('/ledger/v1/get-ledger', getLedger);
router.get('/ledger/v1/get-ledger/:id', getLedgerById);
router.put('/ledger/v1/update-ledger/:id', updateLedger);
router.delete('/ledger/v1/delete-ledger/:id', deleteLedger);

module.exports=router;