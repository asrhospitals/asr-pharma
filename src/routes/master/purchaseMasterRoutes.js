const Router = require('express');
const { 
  createPurchaseMaster, 
  getPurchaseMaster, 
  getPurchaseMasterById, 
  updatePurchaseMaster, 
  deletePurchaseMaster
} = require('../../controllers/masters/account/purchaseMaster');

const router = Router();

router.post('/purchase-master/v1/add-purchase-master', 
  createPurchaseMaster
);

router.get('/purchase-master/v1/get-purchase-master', 
  getPurchaseMaster
);

router.get('/purchase-master/v1/get-purchase-master/:id', 
  getPurchaseMasterById
);

router.put('/purchase-master/v1/update-purchase-master/:id', 
  updatePurchaseMaster
);

router.delete('/purchase-master/v1/delete-purchase-master/:id', 
  deletePurchaseMaster
);

module.exports = router; 