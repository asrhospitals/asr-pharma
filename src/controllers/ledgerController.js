/**
 * Ledger Controller
 * Handles HTTP requests for ledger operations
 */

const LedgerService = require("../services/ledgerService");
const { Ledger, Group } = require("../models");

class LedgerController {
  /**
   * Create a new ledger
   * POST /ledger/v1/add-ledger
   */
  static async createLedger(req, res) {
    try {
      const { companyId, ...ledgerData } = req.body;

      // Validate required fields
      if (!ledgerData.ledgerName || !ledgerData.acgroup) {
        return res.status(400).json({
          status: 0,
          message: "Ledger name and account group are required",
          data: null,
        });
      }

      // Validate ledger data
      const validation = await LedgerService.validateLedgerData(
        ledgerData,
        ledgerData.acgroup
      );

      if (!validation.isValid) {
        return res.status(400).json({
          status: 0,
          message: "Validation failed",
          errors: validation.errors,
          data: null,
        });
      }

      const ledger = await LedgerService.createLedger(ledgerData, companyId);

      res.status(201).json({
        status: 1,
        message: "Ledger created successfully",
        data: ledger,
      });
    } catch (error) {
      console.error("Error creating ledger:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to create ledger",
        data: null,
      });
    }
  }

  /**
   * Update an existing ledger
   * PUT /ledger/v1/update-ledger/:id
   */
  static async updateLedger(req, res) {
    try {
      const { id } = req.params;
      const { companyId, ...ledgerData } = req.body;

      const ledger = await LedgerService.updateLedger(id, ledgerData, companyId);

      res.json({
        status: 1,
        message: "Ledger updated successfully",
        data: ledger,
      });
    } catch (error) {
      console.error("Error updating ledger:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to update ledger",
        data: null,
      });
    }
  }

  /**
   * Get all ledgers for a company
   * GET /ledger/v1/get-ledger
   */
  static async getLedgers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        groupId,
        balanceType,
        status,
        isActive,
        companyId,
      } = req.query;

      const result = await LedgerService.getLedgersByCompany(companyId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        groupId,
        balanceType,
        status,
        isActive: isActive !== undefined ? isActive === "true" : null,
      });

      res.json({
        status: 1,
        message: "Ledgers retrieved successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching ledgers:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch ledgers",
        data: null,
      });
    }
  }

  /**
   * Get ledgers by company ID
   * GET /ledger/v1/get-ledger/by-companyId/:companyId
   */
  static async getLedgersByCompanyId(req, res) {
    try {
      const { companyId } = req.params;
      const {
        page = 1,
        limit = 10,
        search = "",
        groupId,
        balanceType,
        status,
        isActive,
      } = req.query;

      const result = await LedgerService.getLedgersByCompany(companyId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        groupId,
        balanceType,
        status,
        isActive: isActive !== undefined ? isActive === "true" : null,
      });

      res.json({
        status: 1,
        message: "Ledgers retrieved successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching ledgers:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch ledgers",
        data: null,
      });
    }
  }

  /**
   * Get a single ledger by ID
   * GET /ledger/v1/get-ledger/:id
   */
  static async getLedgerById(req, res) {
    try {
      const { id } = req.params;

      const ledger = await LedgerService.getLedgerWithGroup(id);

      if (!ledger) {
        return res.status(404).json({
          status: 0,
          message: "Ledger not found",
          data: null,
        });
      }

      res.json({
        status: 1,
        message: "Ledger retrieved successfully",
        data: ledger,
      });
    } catch (error) {
      console.error("Error fetching ledger:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch ledger",
        data: null,
      });
    }
  }

  /**
   * Get ledgers by group
   * GET /ledger/v1/group/:groupId
   */
  static async getLedgersByGroup(req, res) {
    try {
      const { groupId } = req.params;
      const { companyId } = req.query;

      const ledgers = await LedgerService.getLedgersByGroup(groupId, companyId);

      res.json({
        status: 1,
        message: "Ledgers retrieved successfully",
        data: ledgers,
      });
    } catch (error) {
      console.error("Error fetching ledgers:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch ledgers",
        data: null,
      });
    }
  }

  /**
   * Get default ledgers
   * GET /ledger/v1/default-ledgers
   */
  static async getDefaultLedgers(req, res) {
    try {
      const { companyId, groupId } = req.query;

      const ledgers = await LedgerService.getDefaultLedgers(companyId, groupId);

      res.json({
        status: 1,
        message: "Default ledgers retrieved successfully",
        data: ledgers,
      });
    } catch (error) {
      console.error("Error fetching default ledgers:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch default ledgers",
        data: null,
      });
    }
  }

  /**
   * Update opening balance
   * PUT /ledger/v1/:id/opening-balance
   */
  static async updateOpeningBalance(req, res) {
    try {
      const { id } = req.params;
      const { openingBalance, companyId } = req.body;

      if (openingBalance === undefined) {
        return res.status(400).json({
          status: 0,
          message: "Opening balance is required",
          data: null,
        });
      }

      const ledger = await LedgerService.updateOpeningBalance(
        id,
        openingBalance,
        companyId
      );

      res.json({
        status: 1,
        message: "Opening balance updated successfully",
        data: ledger,
      });
    } catch (error) {
      console.error("Error updating opening balance:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to update opening balance",
        data: null,
      });
    }
  }

  /**
   * Get ledger balance
   * GET /ledger/v1/:id/balance
   */
  static async getLedgerBalance(req, res) {
    try {
      const { id } = req.params;
      const { asOfDate, companyId } = req.query;

      const balance = await LedgerService.getLedgerBalance(
        id,
        companyId,
        asOfDate
      );

      res.json({
        status: 1,
        message: "Ledger balance retrieved successfully",
        data: balance,
      });
    } catch (error) {
      console.error("Error fetching ledger balance:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to fetch ledger balance",
        data: null,
      });
    }
  }

  /**
   * Delete a ledger
   * DELETE /ledger/v1/delete-ledger/:id
   */
  static async deleteLedger(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.body;

      const result = await LedgerService.deleteLedger(id, companyId);

      res.json({
        status: 1,
        message: result.message,
        data: null,
      });
    } catch (error) {
      console.error("Error deleting ledger:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to delete ledger",
        data: null,
      });
    }
  }

  /**
   * Validate ledger data
   * POST /ledger/v1/validate
   */
  static async validateLedger(req, res) {
    try {
      const { ledgerData, groupId } = req.body;

      const validation = await LedgerService.validateLedgerData(
        ledgerData,
        groupId
      );

      res.json({
        status: validation.isValid ? 1 : 0,
        message: validation.isValid ? "Validation passed" : "Validation failed",
        data: {
          isValid: validation.isValid,
          errors: validation.errors,
        },
      });
    } catch (error) {
      console.error("Error validating ledger:", error);
      res.status(500).json({
        status: 0,
        message: error.message || "Failed to validate ledger",
        data: null,
      });
    }
  }
}

module.exports = LedgerController;
