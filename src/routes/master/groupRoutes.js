const express = require('express');
const router = express.Router();
const GroupController = require('../../controllers/masters/account/group');
const { 
  canEditGroup, 
  canDeleteGroup,
  canCreateGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
} = require('../../middleware/permissions/groupPermissionMiddleware');
const authMiddleware = require('../../middleware/auth/authMiddleware');

router.use(authMiddleware);

router.post('/groups', canCreateGroup, GroupController.createGroup);
router.get('/groups', GroupController.getAllGroups);
router.get('/groups/hierarchy', GroupController.getGroupHierarchy);
router.get('/groups/type/:groupType', GroupController.getGroupsByType);
router.get('/groups/parent/:parentId', GroupController.getGroupsByParent);
router.get('/groups/available-parents', GroupController.getAvailableParents);
router.get('/groups/:id', GroupController.getGroupById);
router.put('/groups/:id', canEditGroup, GroupController.updateGroup);
router.delete('/groups/:id', canDeleteGroup, GroupController.deleteGroup);


router.get('/groups/:groupId/permissions', GroupController.getGroupPermissions);
router.post('/groups/:groupId/permissions/:userId', GroupController.setGroupPermission);








module.exports = router;