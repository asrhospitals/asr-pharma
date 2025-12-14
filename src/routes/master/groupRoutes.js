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

/**
 * @swagger
 * /pharmacy/api/groups:
 *   post:
 *     tags:
 *       - Accounting - Groups
 *     summary: Create group
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Group created successfully
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get all groups
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.post('/groups', canCreateGroup, GroupController.createGroup);
router.get('/groups', GroupController.getAllGroups);

/**
 * @swagger
 * /pharmacy/api/groups/hierarchy:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get group hierarchy
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Group hierarchy
 */
router.get('/groups/hierarchy', GroupController.getGroupHierarchy);

/**
 * @swagger
 * /pharmacy/api/groups/type/{groupType}:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get groups by type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupType
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groups of specified type
 */
router.get('/groups/type/:groupType', GroupController.getGroupsByType);

/**
 * @swagger
 * /pharmacy/api/groups/parent/{parentId}:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get groups by parent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: parentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Groups with specified parent
 */
router.get('/groups/parent/:parentId', GroupController.getGroupsByParent);

/**
 * @swagger
 * /pharmacy/api/groups/available-parents:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get available parents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available parents
 */
router.get('/groups/available-parents', GroupController.getAvailableParents);

/**
 * @swagger
 * /pharmacy/api/groups/{id}:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get group by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details
 *   put:
 *     tags:
 *       - Accounting - Groups
 *     summary: Update group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Group updated successfully
 *   delete:
 *     tags:
 *       - Accounting - Groups
 *     summary: Delete group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 */
router.get('/groups/:id', GroupController.getGroupById);
router.put('/groups/:id', canEditGroup, GroupController.updateGroup);
router.delete('/groups/:id', canDeleteGroup, GroupController.deleteGroup);

/**
 * @swagger
 * /pharmacy/api/groups/{groupId}/permissions:
 *   get:
 *     tags:
 *       - Accounting - Groups
 *     summary: Get group permissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group permissions
 */
router.get('/groups/:groupId/permissions', GroupController.getGroupPermissions);

/**
 * @swagger
 * /pharmacy/api/groups/{groupId}/permissions/{userId}:
 *   post:
 *     tags:
 *       - Accounting - Groups
 *     summary: Set group permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: groupId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Permission set successfully
 */
router.post('/groups/:groupId/permissions/:userId', GroupController.setGroupPermission);








module.exports = router;