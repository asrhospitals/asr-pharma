/**
 * Ledger Service
 * Handles business logic for ledger operations
 */

const { Ledger, Group, UserCompany } = require("../models");
const { Op } = require("sequelize");

class LedgerService {
  /**
   * Create a new ledger
   */
  static async createLedger(ledgerData, companyId) {
    try {
      // Validate group exists
      const group = await Group.findByPk(ledgerData.acgroup);
      if (!group) {
        throw new Error("Account group not found");
      }

      // Check for duplicate ledger name in company
      const existingLedger = await Ledger.findOne({
        where: {
          ledgerName: ledgerData.ledgerName,
          companyId,
        },
      });

      if (existingLedger) {
        throw new Error("Ledger with this name already exists in your company");
      }

      const ledger = await Ledger.create({
        ...ledgerData,
        companyId,
        balance: ledgerData.openingBalance || 0,
      });

      return await this.getLedgerWithGroup(ledger.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing ledger
   */
  static async updateLedger(ledgerId, ledgerData, companyId) {
    try {
      const ledger = await Ledger.findOne({
        where: { id: ledgerId, companyId },
      });

      if (!ledger) {
        throw new Error("Ledger not found");
      }

      // If changing group, validate new group exists
      if (ledgerData.acgroup && ledgerData.acgroup !== ledger.acgroup) {
        const group = await Group.findByPk(ledgerData.acgroup);
        if (!group) {
          throw new Error("Account group not found");
        }
      }

      // Check for duplicate name if changing name
      if (ledgerData.ledgerName && ledgerData.ledgerName !== ledger.ledgerName) {
        const existingLedger = await Ledger.findOne({
          where: {
            ledgerName: ledgerData.ledgerName,
            companyId,
            id: { [Op.ne]: ledgerId },
          },
        });

        if (existingLedger) {
          throw new Error("Ledger with this name already exists in your company");
        }
      }

      await ledger.update(ledgerData);
      return await this.getLedgerWithGroup(ledger.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ledger with associated group
   */
  static async getLedgerWithGroup(ledgerId) {
    return await Ledger.findByPk(ledgerId, {
      include: [
        {
          model: Group,
          as: "accountGroup",
          attributes: [
            "id",
            "groupName",
            "groupType",
            "formConfig",
            "undergroup",
          ],
        },
      ],
    });
  }

  /**
   * Get all ledgers for a company with filters
   */
  static async getLedgersByCompany(
    companyId,
    {
      page = 1,
      limit = 10,
      search = "",
      groupId = null,
      balanceType = null,
      status = null,
      isActive = null,
    } = {}
  ) {
    try {
      const offset = (page - 1) * limit;
      const where = { companyId };

      // Apply filters
      if (search) {
        where[Op.or] = [
          { ledgerName: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      if (groupId) {
        where.acgroup = groupId;
      }

      if (balanceType) {
        where.balanceType = balanceType;
      }

      if (status) {
        where.status = status;
      }

      if (isActive !== null) {
        where.isActive = isActive;
      }

      const { count, rows } = await Ledger.findAndCountAll({
        where,
        include: [
          {
            model: Group,
            as: "accountGroup",
            attributes: [
              "id",
              "groupName",
              "groupType",
              "formConfig",
              "undergroup",
            ],
          },
        ],
        offset,
        limit,
        order: [["sortOrder", "ASC"], ["ledgerName", "ASC"]],
      });

      return {
        data: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ledgers by group
   */
  static async getLedgersByGroup(groupId, companyId) {
    try {
      return await Ledger.findAll({
        where: {
          acgroup: groupId,
          companyId,
          isActive: true,
        },
        include: [
          {
            model: Group,
            as: "accountGroup",
            attributes: [
              "id",
              "groupName",
              "groupType",
              "formConfig",
              "undergroup",
            ],
          },
        ],
        order: [["sortOrder", "ASC"], ["ledgerName", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get default ledgers for a company
   */
  static async getDefaultLedgers(companyId, groupId = null) {
    try {
      const where = {
        companyId,
        isDefault: true,
        isActive: true,
      };

      if (groupId) {
        where.acgroup = groupId;
      }

      return await Ledger.findAll({
        where,
        include: [
          {
            model: Group,
            as: "accountGroup",
            attributes: [
              "id",
              "groupName",
              "groupType",
              "formConfig",
              "undergroup",
            ],
          },
        ],
        order: [["sortOrder", "ASC"], ["ledgerName", "ASC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update opening balance
   */
  static async updateOpeningBalance(ledgerId, openingBalance, companyId) {
    try {
      const ledger = await Ledger.findOne({
        where: { id: ledgerId, companyId },
      });

      if (!ledger) {
        throw new Error("Ledger not found");
      }

      await ledger.update({
        openingBalance,
        balance: openingBalance,
      });

      return await this.getLedgerWithGroup(ledger.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a ledger
   */
  static async deleteLedger(ledgerId, companyId) {
    try {
      const ledger = await Ledger.findOne({
        where: { id: ledgerId, companyId },
      });

      if (!ledger) {
        throw new Error("Ledger not found");
      }

      if (!ledger.isDeletable) {
        throw new Error("This ledger cannot be deleted");
      }

      // Check if ledger has transactions
      const transactionCount = await ledger.countTransactions?.();
      if (transactionCount > 0) {
        throw new Error("Cannot delete ledger with existing transactions");
      }

      await ledger.destroy();
      return { message: "Ledger deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get ledger balance as of a specific date
   */
  static async getLedgerBalance(ledgerId, companyId, asOfDate = null) {
    try {
      const ledger = await Ledger.findOne({
        where: { id: ledgerId, companyId },
        include: [
          {
            model: Group,
            as: "accountGroup",
            attributes: ["id", "groupName", "groupType"],
          },
        ],
      });

      if (!ledger) {
        throw new Error("Ledger not found");
      }

      // TODO: Calculate balance from transactions if asOfDate is provided
      // For now, return current balance
      return {
        ledgerId,
        ledgerName: ledger.ledgerName,
        openingBalance: ledger.openingBalance,
        currentBalance: ledger.balance,
        balanceType: ledger.balanceType,
        groupName: ledger.accountGroup?.groupName,
        asOfDate: asOfDate || new Date(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate ledger data based on group configuration
   */
  static async validateLedgerData(ledgerData, groupId) {
    try {
      const group = await Group.findByPk(groupId);
      if (!group) {
        throw new Error("Account group not found");
      }

      const errors = [];

      // Basic validation
      if (!ledgerData.ledgerName || ledgerData.ledgerName.trim() === "") {
        errors.push("Ledger name is required");
      }

      if (ledgerData.openingBalance === undefined || ledgerData.openingBalance === null) {
        errors.push("Opening balance is required");
      }

      // Group-specific validation can be added here
      // based on group.formConfig

      return {
        isValid: errors.length === 0,
        errors,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LedgerService;
