const Router = require('express');
const { 
  createSaleMaster, 
  getSaleMaster, 
  getSaleMasterById, 
  updateSaleMaster, 
  deleteSaleMaster
} = require('../../controllers/masters/account/saleMaster');

const {
  canViewLedger
} = require('../../middleware/permissions/groupPermissionMiddleware');

const router = Router();

router.post('/sale-master/v1/add-sale-master', 
  createSaleMaster
);

router.get('/sale-master/v1/get-sale-master', 
  getSaleMaster
);

router.get('/sale-master/v1/get-sale-master/:id', 
  getSaleMasterById
);

router.put('/sale-master/v1/update-sale-master/:id', 
  updateSaleMaster
);

router.delete('/sale-master/v1/delete-sale-master/:id', 
  deleteSaleMaster
);

module.exports = router; 