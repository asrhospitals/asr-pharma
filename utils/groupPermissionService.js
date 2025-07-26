const { Group, GroupPermission, User } = require('../models');

class GroupPermissionService {
  /**
   * Check if user has permission for a specific action on a group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @param {string} action - Action to check (createLedger, editLedger, etc.)
   * @returns {boolean} - Whether user has permission
   */
  static async hasGroupPermission(userId, groupId, action) {
    try {
      // Check if user is admin (admin has all permissions)
      const user = await User.findByPk(userId);
      if (user && user.role === 'admin') {
        return true;
      }

      // Get group permission for this user and group
      const permission = await GroupPermission.findOne({
        where: {
          userId,
          groupId,
          status: 'Active'
        }
      });

      if (!permission) {
        return false;
      }

      // Check if permission is currently effective
      const now = new Date();
      if (permission.effectiveFrom && permission.effectiveFrom > now) {
        return false;
      }
      if (permission.effectiveTo && permission.effectiveTo < now) {
        return false;
      }

      // Check if group is restricted
      if (permission.isRestricted) {
        return false;
      }

      // Map action to permission field
      const actionMap = {
        'createLedger': 'canCreateLedger',
        'editLedger': 'canEditLedger',
        'deleteLedger': 'canDeleteLedger',
        'viewLedger': 'canViewLedger',
        'createTransaction': 'canCreateTransaction',
        'editTransaction': 'canEditTransaction',
        'deleteTransaction': 'canDeleteTransaction',
        'viewTransaction': 'canViewTransaction',
        'viewReport': 'canViewReport',
        'exportReport': 'canExportReport',
        'viewBalance': 'canViewBalance',
        'modifyBalance': 'canModifyBalance',
        'setOpeningBalance': 'canSetOpeningBalance',
        'createSubGroup': 'canCreateSubGroup',
        'editGroup': 'canEditGroup',
        'deleteGroup': 'canDeleteGroup'
      };

      const permissionField = actionMap[action];
      if (!permissionField) {
        return false;
      }

      return permission[permissionField] || false;
    } catch (error) {
      console.error('Error checking group permission:', error);
      throw error; // Re-throw to get proper error message
    }
  }

  /**
   * Get all permissions for a user across all groups
   * @param {number} userId - User ID
   * @returns {Array} - Array of group permissions
   */
  static async getUserGroupPermissions(userId) {
    try {
      const permissions = await GroupPermission.findAll({
        where: {
          userId,
          status: 'Active'
        },
        include: [
          {
            model: Group,
            as: 'group',
            attributes: ['id', 'groupName', 'groupType', 'isDefault', 'isEditable', 'isDeletable']
          }
        ]
      });

      return permissions;
    } catch (error) {
      console.error('Error getting user group permissions:', error);
      return [];
    }
  }

  /**
   * Get all permissions for a specific group
   * @param {number} groupId - Group ID
   * @returns {Array} - Array of user permissions for the group
   */
  static async getGroupPermissions(groupId) {
    try {
      const permissions = await GroupPermission.findAll({
        where: {
          groupId,
          status: 'Active'
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'uname', 'fname', 'lname', 'role']
          }
        ]
      });

      return permissions;
    } catch (error) {
      console.error('Error getting group permissions:', error);
      return [];
    }
  }

  /**
   * Set permissions for a user on a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @param {Object} permissions - Permission object
   * @returns {Object} - Created/updated permission
   */
  static async setGroupPermission(userId, groupId, permissions) {
    try {
      const [permission, created] = await GroupPermission.findOrCreate({
        where: {
          userId,
          groupId
        },
        defaults: {
          ...permissions,
          status: 'Active'
        }
      });

      if (!created) {
        await permission.update(permissions);
      }

      return permission;
    } catch (error) {
      console.error('Error setting group permission:', error);
      throw error;
    }
  }

  /**
   * Remove permissions for a user on a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Success status
   */
  static async removeGroupPermission(userId, groupId) {
    try {
      const result = await GroupPermission.destroy({
        where: {
          userId,
          groupId
        }
      });

      return result > 0;
    } catch (error) {
      console.error('Error removing group permission:', error);
      return false;
    }
  }

  /**
   * Check if a group can be edited by a user
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether group can be edited
   */
  static async canEditGroup(userId, groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return false;
      }

      // Check if group is editable
      if (!group.isEditable) {
        return false;
      }

      // Check user permissions
      return await this.hasGroupPermission(userId, groupId, 'editGroup');
    } catch (error) {
      console.error('Error checking if group can be edited:', error);
      return false;
    }
  }

  /**
   * Check if a group can be deleted by a user
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether group can be deleted
   */
  static async canDeleteGroup(userId, groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return false;
      }

      // Check if group is deletable
      if (!group.isDeletable) {
        return false;
      }

      // Check if group has ledgers (if Ledger model is available)
      try {
        const { Ledger } = require('../models');
        if (Ledger) {
          const ledgerCount = await Ledger.count({ where: { acgroup: groupId } });
          if (ledgerCount > 0) {
            return false;
          }
        }
      } catch (error) {
        // Ledger model not available, skip this check
        console.log('Ledger model not available, skipping ledger count check:', error.message);
      }

      // Check if group has sub-groups (recursive check)
      const hasSubGroups = await this.hasSubGroups(groupId);
      if (hasSubGroups) {
        return false;
      }

      // Check user permissions
      return await this.hasGroupPermission(userId, groupId, 'deleteGroup');
    } catch (error) {
      console.error('Error checking if group can be deleted:', error);
      throw error; // Re-throw to get proper error message
    }
  }

  /**
   * Check if a group has sub-groups (recursive)
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether group has sub-groups
   */
  static async hasSubGroups(groupId) {
    try {
      const subGroups = await Group.findAll({ where: { parentGroupId: groupId } });
      
      if (subGroups.length > 0) {
        return true;
      }

      // Check recursively
      for (const subGroup of subGroups) {
        const hasNestedSubGroups = await this.hasSubGroups(subGroup.id);
        if (hasNestedSubGroups) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking for sub-groups:', error);
      return false;
    }
  }

  /**
   * Get groups that a user can access
   * @param {number} userId - User ID
   * @returns {Array} - Array of accessible groups
   */
  static async getAccessibleGroups(userId) {
    try {
      const user = await User.findByPk(userId);
      if (user && user.role === 'admin') {
        // Admin can access all groups
        return await Group.findAll({
          where: { status: 'Active' },
          order: [['sortOrder', 'ASC'], ['groupName', 'ASC']]
        });
      }

      // Get groups where user has at least view permission
      const permissions = await GroupPermission.findAll({
        where: {
          userId,
          status: 'Active'
        },
        include: [
          {
            model: Group,
            as: 'group',
            where: { status: 'Active' },
            attributes: ['id', 'groupName', 'groupType', 'isDefault', 'isEditable', 'isDeletable', 'parentGroupId', 'sortOrder']
          }
        ]
      });

      return permissions.map(p => p.group);
    } catch (error) {
      console.error('Error getting accessible groups:', error);
      return [];
    }
  }

  /**
   * Get full hierarchy of groups for a user
   * @param {number} userId - User ID
   * @returns {Array} - Array of groups with hierarchy
   */
  static async getGroupHierarchy(userId) {
    try {
      const accessibleGroups = await this.getAccessibleGroups(userId);
      
      // Build recursive hierarchy
      const buildHierarchy = (groups, parentId = null, level = 0) => {
        return groups
          .filter(group => group.parentGroupId === parentId)
          .map(group => ({
            ...group.toJSON(),
            level,
            children: buildHierarchy(groups, group.id, level + 1)
          }));
      };

      return buildHierarchy(accessibleGroups);
    } catch (error) {
      console.error('Error getting group hierarchy:', error);
      return [];
    }
  }

  /**
   * Get all sub-groups of a group (recursive)
   * @param {number} groupId - Group ID
   * @returns {Array} - Array of all sub-groups
   */
  static async getAllSubGroups(groupId) {
    try {
      const subGroups = await Group.findAll({ where: { parentGroupId: groupId } });
      let allSubGroups = [...subGroups];

      // Get sub-groups recursively
      for (const subGroup of subGroups) {
        const nestedSubGroups = await this.getAllSubGroups(subGroup.id);
        allSubGroups = [...allSubGroups, ...nestedSubGroups];
      }

      return allSubGroups;
    } catch (error) {
      console.error('Error getting all sub-groups:', error);
      return [];
    }
  }

  /**
   * Get all parent groups of a group (recursive)
   * @param {number} groupId - Group ID
   * @returns {Array} - Array of all parent groups
   */
  static async getAllParentGroups(groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group || !group.parentGroupId) {
        return [];
      }

      const parentGroup = await Group.findByPk(group.parentGroupId);
      if (!parentGroup) {
        return [];
      }

      const parentGroups = await this.getAllParentGroups(group.parentGroupId);
      return [parentGroup, ...parentGroups];
    } catch (error) {
      console.error('Error getting all parent groups:', error);
      return [];
    }
  }

  /**
   * Set default permissions for a new user
   * @param {number} userId - User ID
   * @param {string} userRole - User role
   * @returns {Array} - Array of created permissions
   */
  static async setDefaultPermissions(userId, userRole) {
    try {
      const groups = await Group.findAll({
        where: { isDefault: true, status: 'Active' }
      });

      const defaultPermissions = this.getDefaultPermissionsByRole(userRole);
      const createdPermissions = [];

      for (const group of groups) {
        const permission = await this.setGroupPermission(userId, group.id, defaultPermissions);
        createdPermissions.push(permission);
      }

      return createdPermissions;
    } catch (error) {
      console.error('Error setting default permissions:', error);
      throw error;
    }
  }

  /**
   * Inherit permissions from parent group for all users
   * @param {number} newGroupId - New group ID
   * @param {number} parentGroupId - Parent group ID
   * @returns {Array} - Array of inherited permissions
   */
  static async inheritPermissionsFromParent(newGroupId, parentGroupId) {
    try {
      // Get all users who have permissions for the parent group
      const parentPermissions = await GroupPermission.findAll({
        where: {
          groupId: parentGroupId,
          status: 'Active'
        }
      });

      const inheritedPermissions = [];

      for (const parentPermission of parentPermissions) {
        const inheritedPermission = {
          canCreateLedger: parentPermission.canCreateLedger,
          canEditLedger: parentPermission.canEditLedger,
          canDeleteLedger: parentPermission.canDeleteLedger,
          canViewLedger: parentPermission.canViewLedger,
          canCreateTransaction: parentPermission.canCreateTransaction,
          canEditTransaction: parentPermission.canEditTransaction,
          canDeleteTransaction: parentPermission.canDeleteTransaction,
          canViewTransaction: parentPermission.canViewTransaction,
          canViewReport: parentPermission.canViewReport,
          canExportReport: parentPermission.canExportReport,
          canViewBalance: parentPermission.canViewBalance,
          canModifyBalance: parentPermission.canModifyBalance,
          canSetOpeningBalance: parentPermission.canSetOpeningBalance,
          canCreateSubGroup: parentPermission.canCreateSubGroup,
          canEditGroup: parentPermission.canEditGroup,
          canDeleteGroup: parentPermission.canDeleteGroup,
          isRestricted: parentPermission.isRestricted,
          status: 'Active'
        };

        const permission = await this.setGroupPermission(
          parentPermission.userId, 
          newGroupId, 
          inheritedPermission
        );
        inheritedPermissions.push(permission);
      }

      return inheritedPermissions;
    } catch (error) {
      console.error('Error inheriting permissions from parent:', error);
      throw error;
    }
  }

  /**
   * Get default permissions based on user role
   * @param {string} role - User role
   * @returns {Object} - Default permissions object
   */
  static getDefaultPermissionsByRole(role) {
    const basePermissions = {
      canViewLedger: true,
      canViewTransaction: true,
      canViewReport: true,
      canViewBalance: true,
      canCreateLedger: false,
      canEditLedger: false,
      canDeleteLedger: false,
      canCreateTransaction: false,
      canEditTransaction: false,
      canDeleteTransaction: false,
      canExportReport: false,
      canModifyBalance: false,
      canSetOpeningBalance: false,
      canCreateSubGroup: false,
      canEditGroup: false,
      canDeleteGroup: false,
      isRestricted: false,
      status: 'Active'
    };

    switch (role) {
      case 'admin':
        return {
          ...basePermissions,
          canCreateLedger: true,
          canEditLedger: true,
          canDeleteLedger: true,
          canCreateTransaction: true,
          canEditTransaction: true,
          canDeleteTransaction: true,
          canExportReport: true,
          canModifyBalance: true,
          canSetOpeningBalance: true,
          canCreateSubGroup: true,
          canEditGroup: true,
          canDeleteGroup: true
        };
      
      case 'manager':
        return {
          ...basePermissions,
          canCreateLedger: true,
          canEditLedger: true,
          canCreateTransaction: true,
          canEditTransaction: true,
          canExportReport: true,
          canModifyBalance: true,
          canSetOpeningBalance: true,
          canCreateSubGroup: true,
          canEditGroup: true
        };
      
      case 'accountant':
        return {
          ...basePermissions,
          canCreateLedger: true,
          canEditLedger: true,
          canCreateTransaction: true,
          canEditTransaction: true,
          canExportReport: true,
          canModifyBalance: true,
          canSetOpeningBalance: true
        };
      
      case 'viewer':
        return basePermissions;
      
      default:
        return basePermissions;
    }
  }

  /**
   * Check if user can create ledger under a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether user can create ledger
   */
  static async canCreateLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'createLedger');
  }

  /**
   * Check if user can edit ledger under a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether user can edit ledger
   */
  static async canEditLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'editLedger');
  }

  /**
   * Check if user can delete ledger under a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether user can delete ledger
   */
  static async canDeleteLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'deleteLedger');
  }

  /**
   * Check if user can view ledger under a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether user can view ledger
   */
  static async canViewLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'viewLedger');
  }

  /**
   * Check if user can create sub-group under a specific group
   * @param {number} userId - User ID
   * @param {number} groupId - Group ID
   * @returns {boolean} - Whether user can create sub-group
   */
  static async canCreateSubGroup(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'createSubGroup');
  }
}

module.exports = GroupPermissionService; 