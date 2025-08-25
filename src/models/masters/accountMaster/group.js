"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Ledger, {
        foreignKey: "acgroup",
        as: "ledgers",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      Group.hasMany(models.Group, {
        foreignKey: "parentGroupId",
        as: "subGroups",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      Group.belongsTo(models.Group, {
        foreignKey: "parentGroupId",
        as: "parentGroup",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      Group.belongsTo(models.UserCompany, {
        foreignKey: "companyId",
        as: "company",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });

      Group.hasMany(models.GroupPermission, {
        foreignKey: "groupId",
        as: "groupPermissions",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      companyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "company_id",
        references: {
          model: "user_companies",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "group_name",
        validate: {
          notEmpty: true,
        },
      },
      undergroup: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "under_group",
        comment: "Parent group name for hierarchy",
      },
      parentGroupId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "parent_group_id",
        references: {
          model: "groups",
          key: "id",
        },
      },
      groupType: {
        type: DataTypes.ENUM(
          "Asset",
          "Liability",
          "Income",
          "Expense",
          "Capital"
        ),
        field: "group_type",
        allowNull: false,
        comment: "Type of account group",
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_default",
        comment: "Whether this is a default system group",
      },
      isEditable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_editable",
        comment: "Whether this group can be edited",
      },
      isDeletable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_deletable",
        comment: "Whether this group can be deleted",
      },
      prohibit: {
        type: DataTypes.ENUM("Yes", "No"),
        defaultValue: "No",
        comment: "Whether this group is prohibited from certain operations",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: "sort_order",
        comment: "Order for display purposes",
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        defaultValue: "Active",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Group",
      tableName: "groups",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["company_id", "group_name"],
          name: "unique_group_name_per_company",
        },
        {
          fields: ["parent_group_id"],
        },
        {
          fields: ["groupType"],
        },
        {
          fields: ["isDefault"],
        },
        {
          fields: ["company_id"],
        },
      ],
    }
  );

  return Group;
};
