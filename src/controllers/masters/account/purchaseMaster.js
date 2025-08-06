const db = require("../../../database");
const { PurchaseMaster, Ledger } = db;
const { Op } = require('sequelize');

const createPurchaseMaster = async (req, res) => {
  try {
    const {
      purchaseType,
      localPurchaseLedgerId,
      centralPurchaseLedgerId,
      igstPercentage = 0,
      cgstPercentage = 0,
      sgstPercentage = 0,
      cessPercentage = 0,
      natureOfTransaction = 'Purchase',
      taxability = 'Taxable',
      igstLedgerId,
      cgstLedgerId,
      sgstLedgerId,
      cessLedgerId,
      description,
      sortOrder = 0
    } = req.body;

    if (!purchaseType || !localPurchaseLedgerId || !centralPurchaseLedgerId || 
        !igstLedgerId || !cgstLedgerId || !sgstLedgerId || !cessLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const existingPurchaseMaster = await PurchaseMaster.findOne({
      where: { purchaseType: { [Op.iLike]: purchaseType } }
    });

    if (existingPurchaseMaster) {
      return res.status(400).json({
        success: false,
        message: 'Purchase type already exists'
      });
    }

    const ledgerIds = [localPurchaseLedgerId, centralPurchaseLedgerId, igstLedgerId, cgstLedgerId, sgstLedgerId, cessLedgerId];
    const ledgers = await Ledger.findAll({
      where: { id: { [Op.in]: ledgerIds } }
    });

    if (ledgers.length !== ledgerIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more ledger IDs are invalid'
      });
    }

    const percentages = [igstPercentage, cgstPercentage, sgstPercentage, cessPercentage];
    for (const percentage of percentages) {
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Percentages must be between 0 and 100'
        });
      }
    }

    // Enforce Purchase only for this module
    if (natureOfTransaction !== 'Purchase') {
      return res.status(400).json({
        success: false,
        message: 'This module only supports Purchase transactions. Sales transactions should be handled separately.'
      });
    }

    if (!['Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'].includes(taxability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid taxability status'
      });
    }

    const purchaseMasterData = {
      purchaseType: purchaseType.trim(),
      localPurchaseLedgerId,
      centralPurchaseLedgerId,
      igstPercentage: parseFloat(igstPercentage),
      cgstPercentage: parseFloat(cgstPercentage),
      sgstPercentage: parseFloat(sgstPercentage),
      cessPercentage: parseFloat(cessPercentage),
      natureOfTransaction,
      taxability,
      igstLedgerId,
      cgstLedgerId,
      sgstLedgerId,
      cessLedgerId,
      description: description?.trim(),
      sortOrder: parseInt(sortOrder) || 0,
      isActive: true,
      status: 'Active'
    };

    const purchaseMaster = await PurchaseMaster.create(purchaseMasterData);

    const createdPurchaseMaster = await PurchaseMaster.findByPk(purchaseMaster.id, {
      include: [
        { model: Ledger, as: 'localPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Purchase master created successfully',
      data: createdPurchaseMaster
    });

  } catch (error) {
    console.error('Purchase master creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create purchase master',
      error: error.message
    });
  }
};

const getPurchaseMaster = async (req, res) => {
  try {
    const {
      page = 1,
      limit=10,
      search = '',
      taxability,
      status,
      isActive
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      natureOfTransaction: 'Purchase'
    };

    if (search) {
      whereClause[Op.and] = [
        { natureOfTransaction: 'Purchase' },
        { purchaseType: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (taxability) {
      whereClause.taxability = taxability;
    }

    if (status) {
      whereClause.status = status;
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows } = await PurchaseMaster.findAndCountAll({
      where: whereClause,
      include: [
        { model: Ledger, as: 'localPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ],
      order: [['sortOrder', 'ASC'], ['purchaseType', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      message: 'Purchase masters retrieved successfully',
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get purchase masters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve purchase masters',
      error: error.message
    });
  }
};

const getPurchaseMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseMaster = await PurchaseMaster.findByPk(id, {
      include: [
        { model: Ledger, as: 'localPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    if (!purchaseMaster) {
      return res.status(404).json({
        success: false,
        message: 'Purchase master not found'
      });
    }

    res.json({
      success: true,
      message: 'Purchase master retrieved successfully',
      data: purchaseMaster
    });

  } catch (error) {
    console.error('Get purchase master by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve purchase master',
      error: error.message
    });
  }
};

const updatePurchaseMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      purchaseType,
      localPurchaseLedgerId,
      centralPurchaseLedgerId,
      igstPercentage,
      cgstPercentage,
      sgstPercentage,
      cessPercentage,
      natureOfTransaction,
      taxability,
      igstLedgerId,
      cgstLedgerId,
      sgstLedgerId,
      cessLedgerId,
      description,
      sortOrder,
      isActive,
      status
    } = req.body;

    const purchaseMaster = await PurchaseMaster.findByPk(id);
    if (!purchaseMaster) {
      return res.status(404).json({
        success: false,
        message: 'Purchase master not found'
      });
    }

    if (purchaseMaster.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default purchase masters cannot be edited'
      });
    }

    if (purchaseType && purchaseType !== purchaseMaster.purchaseType) {
      const existingPurchaseMaster = await PurchaseMaster.findOne({
        where: { 
          purchaseType: { [Op.iLike]: purchaseType },
          id: { [Op.ne]: id }
        }
      });

      if (existingPurchaseMaster) {
        return res.status(400).json({
          success: false,
          message: 'Purchase type already exists'
        });
      }
    }

    if (localPurchaseLedgerId || centralPurchaseLedgerId || igstLedgerId || 
        cgstLedgerId || sgstLedgerId || cessLedgerId) {
      const ledgerIds = [
        localPurchaseLedgerId || purchaseMaster.localPurchaseLedgerId,
        centralPurchaseLedgerId || purchaseMaster.centralPurchaseLedgerId,
        igstLedgerId || purchaseMaster.igstLedgerId,
        cgstLedgerId || purchaseMaster.cgstLedgerId,
        sgstLedgerId || purchaseMaster.sgstLedgerId,
        cessLedgerId || purchaseMaster.cessLedgerId
      ];

      const ledgers = await Ledger.findAll({
        where: { id: { [Op.in]: ledgerIds } }
      });

      if (ledgers.length !== ledgerIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more ledger IDs are invalid'
        });
      }
    }

    const percentages = [igstPercentage, cgstPercentage, sgstPercentage, cessPercentage];
    for (const percentage of percentages) {
      if (percentage !== undefined && (isNaN(percentage) || percentage < 0 || percentage > 100)) {
        return res.status(400).json({
          success: false,
          message: 'Percentages must be between 0 and 100'
        });
      }
    }

    if (natureOfTransaction && natureOfTransaction !== 'Purchase') {
      return res.status(400).json({
        success: false,
        message: 'This module only supports Purchase transactions. Sales transactions should be handled separately.'
      });
    }

    if (taxability && !['Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'].includes(taxability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid taxability status'
      });
    }

    if (status && !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = {};
    
    if (purchaseType !== undefined) updateData.purchaseType = purchaseType.trim();
    if (localPurchaseLedgerId !== undefined) updateData.localPurchaseLedgerId = localPurchaseLedgerId;
    if (centralPurchaseLedgerId !== undefined) updateData.centralPurchaseLedgerId = centralPurchaseLedgerId;
    if (igstPercentage !== undefined) updateData.igstPercentage = parseFloat(igstPercentage);
    if (cgstPercentage !== undefined) updateData.cgstPercentage = parseFloat(cgstPercentage);
    if (sgstPercentage !== undefined) updateData.sgstPercentage = parseFloat(sgstPercentage);
    if (cessPercentage !== undefined) updateData.cessPercentage = parseFloat(cessPercentage);
    if (natureOfTransaction !== undefined) updateData.natureOfTransaction = natureOfTransaction;
    if (taxability !== undefined) updateData.taxability = taxability;
    if (igstLedgerId !== undefined) updateData.igstLedgerId = igstLedgerId;
    if (cgstLedgerId !== undefined) updateData.cgstLedgerId = cgstLedgerId;
    if (sgstLedgerId !== undefined) updateData.sgstLedgerId = sgstLedgerId;
    if (cessLedgerId !== undefined) updateData.cessLedgerId = cessLedgerId;
    if (description !== undefined) updateData.description = description?.trim();
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (status !== undefined) updateData.status = status;

    await purchaseMaster.update(updateData);

    const updatedPurchaseMaster = await PurchaseMaster.findByPk(id, {
      include: [
        { model: Ledger, as: 'localPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralPurchaseLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    res.json({
      success: true,
      message: 'Purchase master updated successfully',
      data: updatedPurchaseMaster
    });

  } catch (error) {
    console.error('Update purchase master error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update purchase master',
      error: error.message
    });
  }
};

const deletePurchaseMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseMaster = await PurchaseMaster.findByPk(id);
    if (!purchaseMaster) {
      return res.status(404).json({
        success: false,
        message: 'Purchase master not found'
      });
    }

    if (purchaseMaster.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default purchase masters cannot be deleted'
      });
    }

    await purchaseMaster.destroy();

    res.json({
      success: true,
      message: 'Purchase master deleted successfully'
    });

  } catch (error) {
    console.error('Delete purchase master error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete purchase master',
      error: error.message
    });
  }
};

module.exports = {
  createPurchaseMaster,
  getPurchaseMaster,
  getPurchaseMasterById,
  updatePurchaseMaster,
  deletePurchaseMaster
}; 