const Router = require('express');
const { 
  createSaleMaster, 
  getSaleMaster, 
  getSaleMasterById, 
  updateSaleMaster, 
  deleteSaleMaster
} = require('../../controllers/masters/account/saleMaster');

const {
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
} = require('../../middleware/permissions/groupPermissionMiddleware');

const router = Router();

router.post('/sale-master/v1/add-sale-master', 
  canCreateLedger,
  createSaleMaster
);

router.get('/sale-master/v1/get-sale-master', 
  canViewLedger,
  getSaleMaster
);

router.get('/sale-master/v1/get-sale-master/:id', 
  canViewLedger,
  getSaleMasterById
);

router.put('/sale-master/v1/update-sale-master/:id', 
  canEditLedger,
  updateSaleMaster
);

router.delete('/sale-master/v1/delete-sale-master/:id', 
  canDeleteLedger,
  deleteSaleMaster
);

module.exports = router; 