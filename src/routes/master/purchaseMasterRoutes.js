const Router = require('express');
const { 
  createPurchaseMaster, 
  getPurchaseMaster, 
  getPurchaseMasterById, 
  updatePurchaseMaster, 
  deletePurchaseMaster
} = require('../../controllers/masters/account/purchaseMaster');

const {
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
} = require('../../middleware/permissions/groupPermissionMiddleware');

const router = Router();

router.post('/purchase-master/v1/add-purchase-master', 
  canCreateLedger,
  createPurchaseMaster
);

router.get('/purchase-master/v1/get-purchase-master', 
  canViewLedger,
  getPurchaseMaster
);

router.get('/purchase-master/v1/get-purchase-master/:id', 
  canViewLedger,
  getPurchaseMasterById
);

router.put('/purchase-master/v1/update-purchase-master/:id', 
  canEditLedger,
  updatePurchaseMaster
);

router.delete('/purchase-master/v1/delete-purchase-master/:id', 
  canDeleteLedger,
  deletePurchaseMaster
);

module.exports = router; 