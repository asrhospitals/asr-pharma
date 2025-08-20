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
    }
  }

  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
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
        unique: true,
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
        type: DataTypes.INTEGER,
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
          fields: ["groupName"],
        },
        {
          fields: ["parentGroupId"],
        },
        {
          fields: ["groupType"],
        },
        {
          fields: ["isDefault"],
        },
        {
          fields: ["companyId"],
        },
      ],
    }
  );

  return Group;
};
