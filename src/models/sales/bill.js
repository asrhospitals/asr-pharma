"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bill extends Model {
    static associate(models) {
      Bill.hasMany(models.BillItem, {
        foreignKey: "billId",
        as: "billItems",
      });
    }
  }

  Bill.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      userCompanyId: { type: DataTypes.UUID, allowNull: false },
      billNo: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      partyName: { type: DataTypes.STRING },
      patientId: { type: DataTypes.STRING },
      patientName: { type: DataTypes.STRING },
      doctorId: { type: DataTypes.STRING },
      doctorName: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      status: { type: DataTypes.ENUM('Draft', 'Paid', 'Pending', 'Cancelled'), defaultValue: 'Draft' },
      paymentStatus: { type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid'), defaultValue: 'Unpaid' },
      subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      itemDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      billDiscountPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      billDiscountAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      cgstPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      cgstAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      sgstPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
      sgstAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      totalAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      paidAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      dueAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      notes: { type: DataTypes.TEXT },
      createdBy: { type: DataTypes.UUID },
      updatedBy: { type: DataTypes.UUID },
    },
    {
      timestamps: true,
      sequelize,
      modelName: "Bill",
      tableName: "bills",
    }
  );

  return Bill;
};
