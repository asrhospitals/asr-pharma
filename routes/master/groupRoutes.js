const express = require('express');
const router = express.Router();
const GroupController = require('../../controller/masters/account/group');
const { 
  canEditGroup, 
  canDeleteGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
} = require('../../middleware/groupPermissionMiddleware');
const authMiddleware = require('../../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/groups', GroupController.createGroup);
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

router.post('/groups/:groupId/ledgers', canCreateLedger, (req, res) => {
  res.status(200).json({ message: 'Permission check passed for creating ledger' });
});

router.put('/groups/:groupId/ledgers/:ledgerId', canEditLedger, (req, res) => {
  res.status(200).json({ message: 'Permission check passed for editing ledger' });
});

router.delete('/groups/:groupId/ledgers/:ledgerId', canDeleteLedger, (req, res) => {
  res.status(200).json({ message: 'Permission check passed for deleting ledger' });
});

router.get('/groups/:groupId/ledgers', canViewLedger, (req, res) => {
  res.status(200).json({ message: 'Permission check passed for viewing ledgers' });
});

module.exports = router; 