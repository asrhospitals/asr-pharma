const db = require("../../../database");
const { Group, GroupPermission, Ledger } = db;
const GroupPermissionService = require("../../../utils/groupPermissionService");

const inheritPermissionsFromParent = async (userId, parentGroupId) => {
  const parentPermissions = await GroupPermission.findOne({
    where: { userId, groupId: parentGroupId },
  });

  if (parentPermissions) {
    return {
      canView: parentPermissions.canView,
      canCreate: parentPermissions.canCreate,
      canEdit: parentPermissions.canEdit,
      canDelete: parentPermissions.canDelete,
      canManagePermissions: parentPermissions.canManagePermissions,
    };
  }
  return null;
};

const GroupController = {
  createGroup: async (req, res) => {
    try {
      const { groupName, prohibit, parentGroupId } = req.body;
      const userId = req.user.id;

      if (!groupName || !parentGroupId) {
        return res.status(400).json({
          success: false,
          message: "Group name and parent group are required",
        });
      }

      const existingGroup = await Group.findOne({
        where: { groupName },
      });

      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: "Group name already exists",
        });
      }

      const parentGroup = await Group.findByPk(parentGroupId);
      if (!parentGroup) {
        return res.status(400).json({
          success: false,
          message: "Parent group not found",
        });
      }

      const canCreateSubGroup = await GroupPermissionService.canCreateSubGroup(
        userId,
        parentGroupId
      );
      if (!canCreateSubGroup) {
        return res.status(403).json({
          success: false,
          message:
            "You don't have permission to create sub-groups under this parent",
        });
      }

      const maxGroup = await Group.findOne({
        where: { companyId: req.companyId },
        order: [["id", "DESC"]],
      });

      const maxGroupId = maxGroup ? maxGroup.id : 0;

      const group = await Group.create({
        id: maxGroupId + 1,
        groupName,
        groupType: parentGroup.groupType,
        prohibit: prohibit || "No",
        parentGroupId,
        companyId: req.companyId,
        undergroup: parentGroup.groupName,
      });

      await inheritPermissionsFromParent(userId, parentGroupId);

      res.status(201).json({
        success: true,
        message: "Group created successfully",
        data: group,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create group",
        error: error.message,
      });
    }
  },

  getAllGroups: async (req, res) => {
    try {
      const userId = req.user.id;
      const companyId = req.companyId;

      console.log('====================================');
      console.log("companyId:", companyId);
      console.log('====================================');

      const accessibleGroups = await GroupPermissionService.getAccessibleGroups(
        userId,
        companyId
      );

      const buildHierarchy = (groups, parentId = null) => {
        return groups
          .filter((group) => group.parentGroupId === parentId)
          .map((group) => ({
            ...group.toJSON(),
            children: buildHierarchy(groups, group.id),
          }));
      };

      const hierarchy = buildHierarchy(accessibleGroups);

      const groupsWithPermissions = await Promise.all(
        hierarchy.map(async (group) => {
          const permissions = await GroupPermission.findOne({
            where: { userId, groupId: group.id },
          });

          return {
            ...group,
            userPermissions: permissions ? permissions.toJSON() : null,
          };
        })
      );

      res.json({
        success: true,
        data: groupsWithPermissions,
      });
    } catch (error) {
      console.error("Error getting groups:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get groups",
        error: error.message,
      });
    }
  },

  getGroupById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const group = await Group.findByPk(id, {
        include: [
          {
            model: Group,
            as: "subGroups",
            include: [
              {
                model: Group,
                as: "subGroups",
              },
            ],
          },
          {
            model: Group,
            as: "parentGroup",
          },
        ],
      });

      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      const canView = await GroupPermissionService.hasGroupPermission(
        userId,
        group.id,
        "view"
      );
      if (!canView) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view this group",
        });
      }

      const permissions = await GroupPermission.findOne({
        where: { userId, groupId: group.id },
      });

      const groupData = {
        ...group.toJSON(),
        userPermissions: permissions ? permissions.toJSON() : null,
      };

      res.json({
        success: true,
        data: groupData,
      });
    } catch (error) {
      console.error("Error getting group:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get group",
        error: error.message,
      });
    }
  },

  updateGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const { groupName, groupType, prohibit } = req.body;
      const userId = req.user.id;

      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      if (group.isDefault) {
        return res.status(403).json({
          success: false,
          message: "Default groups cannot be modified",
        });
      }

      const canEdit = await GroupPermissionService.canEditGroup(
        userId,
        group.id
      );
      if (!canEdit) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to edit this group",
        });
      }

      if (groupName && groupName !== group.groupName) {
        const existingGroup = await Group.findOne({
          where: { groupName },
        });

        if (existingGroup) {
          return res.status(400).json({
            success: false,
            message: "Group name already exists",
          });
        }
      }

      await group.update({
        groupName: groupName || group.groupName,
        groupType: groupType || group.groupType,
        prohibit: prohibit !== undefined ? prohibit : group.prohibit,
      });

      res.json({
        success: true,
        message: "Group updated successfully",
        data: group,
      });
    } catch (error) {
      console.error("Error updating group:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update group",
        error: error.message,
      });
    }
  },

  deleteGroup: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const group = await Group.findByPk(id);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      if (group.isDefault) {
        return res.status(403).json({
          success: false,
          message: "Default groups cannot be deleted",
        });
      }

      const canDelete = await GroupPermissionService.canDeleteGroup(
        userId,
        group.id
      );
      if (!canDelete) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to delete this group",
        });
      }

      try {
        const ledgerCount = await Ledger.count({
          where: { acgroup: group.id },
        });

        if (ledgerCount > 0) {
          return res.status(400).json({
            success: false,
            message: "Cannot delete group that has ledgers",
          });
        }
      } catch (error) {}

      const hasSubGroups = await GroupPermissionService.hasSubGroups(group.id);
      if (hasSubGroups) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete group that has sub-groups",
        });
      }

      await GroupPermission.destroy({
        where: { groupId: group.id },
      });

      await group.destroy();

      res.json({
        success: true,
        message: "Group deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete group",
        error: error.message,
      });
    }
  },

  getGroupPermissions: async (req, res) => {
    try {
      const { id: groupId } = req.params;
      const userId = req.user.id;

      const canViewPermissions =
        await GroupPermissionService.hasGroupPermission(
          userId,
          groupId,
          "managePermissions"
        );
      if (!canViewPermissions) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to view group permissions",
        });
      }

      const permissions = await GroupPermission.findAll({
        where: { groupId },
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "username", "email", "role"],
          },
        ],
      });

      res.json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      console.error("Error getting group permissions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get group permissions",
        error: error.message,
      });
    }
  },

  setGroupPermission: async (req, res) => {
    try {
      const { id: groupId } = req.params;
      const { userId, permissions } = req.body;
      const currentUserId = req.user.id;

      const canManagePermissions =
        await GroupPermissionService.hasGroupPermission(
          currentUserId,
          groupId,
          "managePermissions"
        );
      if (!canManagePermissions) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to manage group permissions",
        });
      }

      const [groupPermission, created] = await GroupPermission.findOrCreate({
        where: { userId, groupId },
        defaults: {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canManagePermissions: false,
        },
      });

      await groupPermission.update(permissions);

      res.json({
        success: true,
        message: created
          ? "Permission created successfully"
          : "Permission updated successfully",
        data: groupPermission,
      });
    } catch (error) {
      console.error("Error setting group permission:", error);
      res.status(500).json({
        success: false,
        message: "Failed to set group permission",
        error: error.message,
      });
    }
  },

  getGroupsByType: async (req, res) => {
    try {
      const { type } = req.params;
      const userId = req.user.id;

      const accessibleGroups = await GroupPermissionService.getAccessibleGroups(
        userId
      );

      const filteredGroups = accessibleGroups.filter(
        (group) => group.groupType === type
      );

      res.json({
        success: true,
        data: filteredGroups,
      });
    } catch (error) {
      console.error("Error getting groups by type:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get groups by type",
        error: error.message,
      });
    }
  },

  getGroupHierarchy: async (req, res) => {
    try {
      const userId = req.user.id;
      const companyId = req.companyId;

      const accessibleGroups = await GroupPermissionService.getAccessibleGroups(
        userId,
        companyId
      );

      const buildRecursiveHierarchy = (groups, parentId = null) => {
        return groups
          .filter((group) => group.parentGroupId === parentId)
          .map((group) => ({
            ...group.toJSON(),
            children: buildRecursiveHierarchy(groups, group.id),
          }));
      };

      const hierarchy = buildRecursiveHierarchy(accessibleGroups);

      res.json({
        success: true,
        data: hierarchy,
      });
    } catch (error) {
      console.error("Error getting group hierarchy:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get group hierarchy",
        error: error.message,
      });
    }
  },

  getGroupsByParent: async (req, res) => {
    try {
      const { parentId } = req.params;
      const userId = req.user.id;

      const canAccessParent = await GroupPermissionService.hasGroupPermission(
        userId,
        parentId,
        "view"
      );
      if (!canAccessParent) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to access this parent group",
        });
      }

      const subGroups = await Group.findAll({
        where: { parentGroupId: parentId },
        include: [
          {
            model: Group,
            as: "subGroups",
          },
        ],
      });

      const accessibleSubGroups = await Promise.all(
        subGroups.map(async (group) => {
          const canView = await GroupPermissionService.hasGroupPermission(
            userId,
            group.id,
            "view"
          );
          return canView ? group : null;
        })
      );

      const filteredGroups = accessibleSubGroups.filter(
        (group) => group !== null
      );

      res.json({
        success: true,
        data: filteredGroups,
      });
    } catch (error) {
      console.error("Error getting groups by parent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get groups by parent",
        error: error.message,
      });
    }
  },

  getAvailableParents: async (req, res) => {
    try {
      const userId = req.user.id;

      const allGroups = await Group.findAll({
        include: [
          {
            model: Group,
            as: "subGroups",
          },
        ],
        order: [["groupName", "ASC"]],
      });

      const groupsWhereCanCreateSubGroups = await Promise.all(
        allGroups.map(async (group) => {
          const canCreateSubGroup =
            await GroupPermissionService.canCreateSubGroup(userId, group.id);
          return canCreateSubGroup ? group : null;
        })
      );

      const filteredGroups = groupsWhereCanCreateSubGroups.filter(
        (group) => group !== null
      );

      res.json({
        success: true,
        data: filteredGroups,
      });
    } catch (error) {
      console.error("Error getting available parents:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get available parents",
        error: error.message,
      });
    }
  },
};

module.exports = GroupController;
