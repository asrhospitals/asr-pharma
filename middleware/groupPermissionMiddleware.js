const GroupPermissionService = require('../utils/groupPermissionService');

const canViewGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'view');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking view permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking view permissions'
    });
  }
};

const canCreateGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { parentGroupId } = req.body;

    if (parentGroupId) {
      const canCreateSubGroup = await GroupPermissionService.canCreateSubGroup(userId, parentGroupId);
      if (!canCreateSubGroup) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to create sub-groups under this parent'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error checking create permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking create permissions'
    });
  }
};

const canEditGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const { Group } = require('../models');
    const group = await Group.findByPk(groupId);
    if (group && group.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default groups cannot be edited'
      });
    }

    const hasPermission = await GroupPermissionService.canEditGroup(userId, groupId);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking edit permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking edit permissions'
    });
  }
};

const canDeleteGroup = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const { Group } = require('../models');
    const group = await Group.findByPk(groupId);
    if (group && group.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default groups cannot be deleted'
      });
    }

    const hasPermission = await GroupPermissionService.canDeleteGroup(userId, groupId);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking delete permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking delete permissions'
    });
  }
};

const canCreateLedger = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'create');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create ledgers in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking ledger create permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking ledger create permissions'
    });
  }
};

const canEditLedger = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'edit');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit ledgers in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking ledger edit permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking ledger edit permissions'
    });
  }
};

const canDeleteLedger = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'delete');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete ledgers in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking ledger delete permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking ledger delete permissions'
    });
  }
};

const canViewLedger = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'view');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view ledgers in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking ledger view permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking ledger view permissions'
    });
  }
};

module.exports = {
  canViewGroup,
  canCreateGroup,
  canEditGroup,
  canDeleteGroup,
  canCreateLedger,
  canEditLedger,
  canDeleteLedger,
  canViewLedger
}; 