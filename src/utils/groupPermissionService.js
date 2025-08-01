const db = require('../database');
const { Group, GroupPermission, User } = db;

class GroupPermissionService {
  
  static async hasGroupPermission(userId, groupId, action) {
    try {
      const user = await User.findByPk(userId);
      if (user && user.role === 'admin') {
        return true;
      }

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

      const now = new Date();
      if (permission.effectiveFrom && permission.effectiveFrom > now) {
        return false;
      }
      if (permission.effectiveTo && permission.effectiveTo < now) {
        return false;
      }
      
      if (permission.isRestricted) {
        return false;
      }

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
      return false; 
    }
  }

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

  static async canEditGroup(userId, groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return false;
      }

      if (!group.isEditable) {
        return false;
      }

      return await this.hasGroupPermission(userId, groupId, 'editGroup');
    } catch (error) {
      console.error('Error checking if group can be edited:', error);
      return false;
    }
  }

  static async canDeleteGroup(userId, groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return false;
      }

      if (!group.isDeletable) {
        return false;
      }

      if (group.isDefault) {
        return false;
      }
      try {
        const { Ledger } = db;
        if (Ledger) {
          const ledgerCount = await Ledger.count({ where: { acgroup: groupId } });
          if (ledgerCount > 0) {
            return false;
          }
        }
      } catch (error) {
        console.log('Ledger model not available, skipping ledger count check:', error.message);
      }

      const hasSubGroups = await this.hasSubGroups(groupId);
      if (hasSubGroups) {
        return false;
      }

      return await this.hasGroupPermission(userId, groupId, 'deleteGroup');
    } catch (error) {
      console.error('Error checking if group can be deleted:', error);
      return false; 
    }
  }

  static async hasSubGroups(groupId) {
    try {
      const subGroups = await Group.findAll({ 
        where: { 
          parentGroupId: groupId,
          status: 'Active'
        } 
      });
      
      if (subGroups.length > 0) {
        return true;
      }

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

  static async getAccessibleGroups(userId) {
    try {
      const user = await User.findByPk(userId);
      if (user && user.role === 'admin') {
        return await Group.findAll({
          where: { status: 'Active' },
          order: [['sortOrder', 'ASC'], ['groupName', 'ASC']]
        });
      }

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

  static async getGroupHierarchy(userId) {
    try {
      const accessibleGroups = await this.getAccessibleGroups(userId);
      
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

  static async getAllSubGroups(groupId) {
    try {
      const subGroups = await Group.findAll({ where: { parentGroupId: groupId } });
      let allSubGroups = [...subGroups];

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

  static async inheritPermissionsFromParent(newGroupId, parentGroupId) {
    try {
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


  static async canCreateLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'createLedger');
  }

  
  static async canEditLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'editLedger');
  }

  
  static async canDeleteLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'deleteLedger');
  }

  
  static async canViewLedger(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'viewLedger');
  }


  static async canCreateSubGroup(userId, groupId) {
    return await this.hasGroupPermission(userId, groupId, 'createSubGroup');
  }

  static async hasAnyGroupPermission(userId, action) {
    try {
      const user = await User.findByPk(userId);
      if (user && user.role === 'admin') {
        return true;
      }

      const permissions = await GroupPermission.findAll({
        where: {
          userId,
          status: 'Active'
        }
      });

      if (permissions.length === 0) {
        return false;
      }

      const now = new Date();
      const actionMap = {
        'view': 'canViewLedger',
        'create': 'canCreateLedger',
        'edit': 'canEditLedger',
        'delete': 'canDeleteLedger',
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


      for (const permission of permissions) {
        if (permission.effectiveFrom && permission.effectiveFrom > now) {
          continue;
        }
        if (permission.effectiveTo && permission.effectiveTo < now) {
          continue;
        }
        if (permission.isRestricted) {
          continue;
        }
        if (permission[permissionField]) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking any group permission:', error);
      return false;
    }
  }
}

module.exports = GroupPermissionService; 