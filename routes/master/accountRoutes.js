const Router=require('express');
const { createLedger, getLedger, getLedgerById, updateLedger, deleteLedger } = require('../../controller/masters/account/ledger');
const router=Router();


//-------------------------------------Ledger Master----------------------------------//

// 1. Add Ledger
router.route('/account/add-ledger').post(createLedger);

// 2. Get Ledger
router.route('/account/get-ledger').get(getLedger);

// 3. Get Ledger by Id

router.route('/account/get-ledger/:id').get(getLedgerById);

// 4. Update Ledger

router.route('/account/updt-ledger/:id').put(updateLedger);

// 5. Delete Ledger

router.route('/account/del-ledger/:id').delete(deleteLedger);


module.exports=router;