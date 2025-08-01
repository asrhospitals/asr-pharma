const db = require('../database');
const { Ledger, Group } = db;

class DefaultLedgerService {
  static isDefaultLedger(ledgerId) {
    return Ledger.findOne({
      where: { id: ledgerId, isDefault: true }
    });
  }

  static async isFieldEditable(ledgerId, fieldName) {
    const ledger = await Ledger.findByPk(ledgerId);
    if (!ledger) return false;
    
    if (!ledger.isDefault) return true; // Non-default ledgers are fully editable
    
    return ledger.editableFields && ledger.editableFields.includes(fieldName);
  }

  
  static async getEditableFields(ledgerId) {
    const ledger = await Ledger.findByPk(ledgerId);
    if (!ledger) return [];
    
    if (!ledger.isDefault) {

      return [
        'ledgerName', 'acgroup', 'openingBalance', 'balanceType', 
        'description', 'address', 'isActive', 'status', 'station'
      ];
    }
    
    return ledger.editableFields || [];
  }

  
  static async validateUpdate(ledgerId, updateData) {
    const ledger = await Ledger.findByPk(ledgerId);
    if (!ledger) {
      throw new Error('Ledger not found');
    }

    if (!ledger.isDefault) {
      return true; // Non-default ledgers can be fully updated
    }

    const editableFields = await this.getEditableFields(ledgerId);
    const attemptedFields = Object.keys(updateData);
    
    const nonEditableFields = attemptedFields.filter(field => 
      !editableFields.includes(field)
    );

    if (nonEditableFields.length > 0) {
      throw new Error(`Cannot edit fields for default ledger: ${nonEditableFields.join(', ')}`);
    }

    return true;
  }

  
  static async canDelete(ledgerId) {
    const ledger = await Ledger.findByPk(ledgerId);
    if (!ledger) return false;
    
    return !ledger.isDefault || ledger.isDeletable;
  }

  
  static async getDefaultLedgers() {
    return Ledger.findAll({
      where: { isDefault: true },
      include: [{
        model: Group,
        as: 'group',
        attributes: ['id', 'groupName', 'groupType']
      }],
      order: [['sortOrder', 'ASC']]
    });
  }

  
  static async getDefaultLedgerByName(ledgerName) {
    return Ledger.findOne({
      where: { 
        ledgerName: ledgerName,
        isDefault: true 
      },
      include: [{
        model: Group,
        as: 'group',
        attributes: ['id', 'groupName', 'groupType']
      }]
    });
  }

  
  static async getDefaultLedgersByGroup(groupId) {
    return Ledger.findAll({
      where: { 
        acgroup: groupId,
        isDefault: true 
      },
      include: [{
        model: Group,
        as: 'group',
        attributes: ['id', 'groupName', 'groupType']
      }],
      order: [['sortOrder', 'ASC']]
    });
  }

  
  static async updateDefaultLedger(ledgerId, updateData, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {

      await this.validateUpdate(ledgerId, updateData);
      

      const editableFields = await this.getEditableFields(ledgerId);
      

      const filteredUpdateData = {};
      editableFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          filteredUpdateData[field] = updateData[field];
        }
      });


      filteredUpdateData.updatedAt = new Date();
      
      const result = await Ledger.update(filteredUpdateData, {
        where: { id: ledgerId },
        transaction
      });

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  
  static async createCustomLedger(ledgerData, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {

      ledgerData.isDefault = false;
      ledgerData.isEditable = true;
      ledgerData.isDeletable = true;
      ledgerData.editableFields = [
        'ledgerName', 'acgroup', 'openingBalance', 'balanceType', 
        'description', 'address', 'isActive', 'status', 'station'
      ];

      const ledger = await Ledger.create(ledgerData, { transaction });
      await transaction.commit();
      return ledger;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  
  static async deleteLedger(ledgerId, userId) {
    const transaction = await db.sequelize.transaction();
    
    try {
      const canDelete = await this.canDelete(ledgerId);
      if (!canDelete) {
        throw new Error('Cannot delete default ledger');
      }

      const result = await Ledger.destroy({
        where: { id: ledgerId },
        transaction
      });

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  
  static async getLedgerWithDefaultInfo(ledgerId) {
    const ledger = await Ledger.findByPk(ledgerId, {
      include: [{
        model: Group,
        as: 'group',
        attributes: ['id', 'groupName', 'groupType']
      }]
    });

    if (!ledger) return null;


    const editableFields = await this.getEditableFields(ledgerId);
    const canDelete = await this.canDelete(ledgerId);

    return {
      ...ledger.toJSON(),
      editableFields,
      canDelete,
      isDefaultLedger: ledger.isDefault
    };
  }

  
  static async getAllLedgersWithDefaultInfo() {
    const ledgers = await Ledger.findAll({
      include: [{
        model: Group,
        as: 'group',
        attributes: ['id', 'groupName', 'groupType']
      }],
      order: [
        ['isDefault', 'DESC'],
        ['sortOrder', 'ASC'],
        ['ledgerName', 'ASC']
      ]
    });


    const ledgersWithInfo = await Promise.all(
      ledgers.map(async (ledger) => {
        const editableFields = await this.getEditableFields(ledger.id);
        const canDelete = await this.canDelete(ledger.id);

        return {
          ...ledger.toJSON(),
          editableFields,
          canDelete,
          isDefaultLedger: ledger.isDefault
        };
      })
    );

    return ledgersWithInfo;
  }
}

module.exports = DefaultLedgerService; 