const GroupPermissionService = require('../../utils/groupPermissionService');
const db = require('../../database');
const { Group } = db;

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

    try {
      const group = await Group.findByPk(groupId);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }
      
      if (group.isDefault) {
        return res.status(403).json({
          success: false,
          message: 'Default groups cannot be edited'
        });
      }
    } catch (modelError) {
      console.error('Error accessing Group model:', modelError);
      return res.status(500).json({
        success: false,
        message: 'Error accessing group data'
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

    try {
      const group = await Group.findByPk(groupId);
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Group not found'
        });
      }
      
      if (group.isDefault) {
        return res.status(403).json({
          success: false,
          message: 'Default groups cannot be deleted'
        });
      }
    } catch (modelError) {
      console.error('Error accessing Group model:', modelError);
      return res.status(500).json({
        success: false,
        message: 'Error accessing group data'
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
    const groupId = req.params.id || req.params.groupId || req.body.groupId || req.query.groupId;
    const userId = req.user.id;

    if (!groupId) {

      const hasAnyPermission = await GroupPermissionService.hasAnyGroupPermission(userId, 'view');
      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to view ledgers'
        });
      }
      return next();
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

const canModifyBalance = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'modifyBalance');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify balances in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking balance modification permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking balance modification permissions'
    });
  }
};

const canCreateTransaction = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'createTransaction');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create transactions in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking transaction create permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking transaction create permissions'
    });
  }
};

const canViewTransaction = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'viewTransaction');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view transactions in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking transaction view permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking transaction view permissions'
    });
  }
};

const canEditTransaction = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'editTransaction');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit transactions in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking transaction edit permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking transaction edit permissions'
    });
  }
};

const canDeleteTransaction = async (req, res, next) => {
  try {
    const groupId = req.params.id || req.params.groupId || req.body.groupId;
    const userId = req.user.id;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required'
      });
    }

    const hasPermission = await GroupPermissionService.hasGroupPermission(userId, groupId, 'deleteTransaction');
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete transactions in this group'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking transaction delete permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking transaction delete permissions'
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
  canViewLedger,
  canModifyBalance,
  canCreateTransaction,
  canViewTransaction,
  canEditTransaction,
  canDeleteTransaction
}; 