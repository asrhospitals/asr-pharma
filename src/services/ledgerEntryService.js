const db = require('../database');
const { Transaction, Ledger, Group } = db;
const GroupPermissionService = require('../utils/groupPermissionService');

class LedgerEntryService {
  static async createLedgerEntriesFromBill(billData, billType, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {
      if (!billData.partyId || !billData.totalAmount) {
        throw new Error('Invalid bill data: partyId and totalAmount are required');
      }

      const party = await Ledger.findByPk(billData.partyId);
      if (!party) {
        throw new Error('Party not found');
      }

      const hasPermission = await GroupPermissionService.hasGroupPermission(
        userId, 
        party.acgroup, 
        'createTransaction'
      );

      if (!hasPermission) {
        throw new Error('Permission denied to create transactions for this party');
      }

      const entries = [];
      const currentDate = new Date();

      if (billType === 'PURCHASE') {
        entries.push(
          {
            ledgerId: await this.getPurchaseAccountId(),
            debit: billData.goodsValue || billData.totalAmount,
            credit: 0,
            narration: `${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          },
          {
            ledgerId: billData.partyId,
            debit: 0,
            credit: billData.totalAmount,
            narration: `${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          }
        );

        if (billData.gstAmount && billData.gstAmount > 0) {
          entries.push({
            ledgerId: await this.getGSTInputAccountId(),
            debit: billData.gstAmount,
            credit: 0,
            narration: `GST Input - ${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          });
        }

      } else if (billType === 'SALE') {
        entries.push(
          {
            ledgerId: billData.partyId,
            debit: billData.totalAmount,
            credit: 0,
            narration: `${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          },
          {
            ledgerId: await this.getSalesAccountId(),
            debit: 0,
            credit: billData.goodsValue || billData.totalAmount,
            narration: `${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          }
        );

        if (billData.gstAmount && billData.gstAmount > 0) {
          entries.push({
            ledgerId: await this.getGSTOutputAccountId(),
            debit: 0,
            credit: billData.gstAmount,
            narration: `GST Output - ${billType} Bill ${billData.billNo || billData.invoiceNo}`,
            billId: billData.id,
            billType: billType,
            date: currentDate,
            userId: userId
          });
        }
      }

      const createdEntries = [];
      for (const entry of entries) {
        const createdEntry = await Transaction.create(entry, { transaction });
        createdEntries.push(createdEntry);
      }

      await transaction.commit();
      return createdEntries;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getLedgerEntriesByBill(billId, userId) {
    try {
      const entries = await Transaction.findAll({
        where: { billId },
        include: [
          {
            model: Ledger,
            as: 'ledger',
            attributes: ['id', 'partyName', 'acgroup']
          }
        ],
        order: [['date', 'ASC']]
      });

      const accessibleEntries = [];
      for (const entry of entries) {
        const hasPermission = await GroupPermissionService.hasGroupPermission(
          userId,
          entry.ledger.acgroup,
          'viewTransaction'
        );

        if (hasPermission) {
          accessibleEntries.push(entry);
        }
      }

      return accessibleEntries;
    } catch (error) {
      console.error('Error getting ledger entries by bill:', error);
      throw error;
    }
  }

  static async deleteLedgerEntriesForBill(billId, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {
      const entries = await Transaction.findAll({
        where: { billId },
        include: [
          {
            model: Ledger,
            as: 'ledger',
            attributes: ['id', 'acgroup']
          }
        ]
      });

      for (const entry of entries) {
        const hasPermission = await GroupPermissionService.hasGroupPermission(
          userId,
          entry.ledger.acgroup,
          'deleteTransaction'
        );

        if (!hasPermission) {
          throw new Error(`Permission denied to delete transaction for ${entry.ledger.partyName}`);
        }
      }

      await Transaction.destroy({
        where: { billId },
        transaction
      });

      await transaction.commit();
      return true;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async updateLedgerEntriesForBill(billId, billData, billType, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {
      await this.deleteLedgerEntriesForBill(billId, userId);
      
      const newEntries = await this.createLedgerEntriesFromBill(billData, billType, userId);
      
      await transaction.commit();
      return newEntries;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getPurchaseAccountId() {
    const purchaseGroup = await Group.findOne({
      where: { groupName: { [db.Sequelize.Op.like]: '%Purchase%' } }
    });
    
    if (!purchaseGroup) {
      throw new Error('Purchase account group not found');
    }
    
    return purchaseGroup.id;
  }

  static async getSalesAccountId() {
    const salesGroup = await Group.findOne({
      where: { groupName: { [db.Sequelize.Op.like]: '%Sales%' } }
    });
    
    if (!salesGroup) {
      throw new Error('Sales account group not found');
    }
    
    return salesGroup.id;
  }

  static async getGSTInputAccountId() {
    const gstInputGroup = await Group.findOne({
      where: { groupName: { [db.Sequelize.Op.like]: '%GST Input%' } }
    });
    
    if (!gstInputGroup) {
      throw new Error('GST Input account group not found');
    }
    
    return gstInputGroup.id;
  }

  static async getGSTOutputAccountId() {
    const gstOutputGroup = await Group.findOne({
      where: { groupName: { [db.Sequelize.Op.like]: '%GST Output%' } }
    });
    
    if (!gstOutputGroup) {
      throw new Error('GST Output account group not found');
    }
    
    return gstOutputGroup.id;
  }

  static validateBillData(billData) {
    const requiredFields = ['partyId', 'totalAmount'];
    
    for (const field of requiredFields) {
      if (!billData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (billData.totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    return true;
  }

  static async getTransactionSummaryForBill(billId, userId) {
    try {
      const entries = await this.getLedgerEntriesByBill(billId, userId);
      
      const summary = {
        totalDebit: 0,
        totalCredit: 0,
        entryCount: entries.length,
        billId: billId
      };

      entries.forEach(entry => {
        summary.totalDebit += entry.debit || 0;
        summary.totalCredit += entry.credit || 0;
      });

      return summary;
    } catch (error) {
      console.error('Error getting transaction summary:', error);
      throw error;
    }
  }
}

module.exports = LedgerEntryService; 