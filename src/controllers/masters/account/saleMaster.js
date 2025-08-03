const db = require("../../../database");
const { SaleMaster, Ledger } = db;
const { Op } = require('sequelize');

const createSaleMaster = async (req, res) => {
  try {
    const {
      salesType,
      localSalesLedgerId,
      centralSalesLedgerId,
      igstPercentage = 0,
      cgstPercentage = 0,
      sgstPercentage = 0,
      cessPercentage = 0,
      natureOfTransaction = 'Sales',
      taxability = 'Taxable',
      igstLedgerId,
      cgstLedgerId,
      sgstLedgerId,
      cessLedgerId,
      description,
      sortOrder = 0
    } = req.body;

    if (!salesType || !localSalesLedgerId || !centralSalesLedgerId || 
        !igstLedgerId || !cgstLedgerId || !sgstLedgerId || !cessLedgerId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const existingSaleMaster = await SaleMaster.findOne({
      where: { salesType: { [Op.iLike]: salesType } }
    });

    if (existingSaleMaster) {
      return res.status(400).json({
        success: false,
        message: 'Sale type already exists'
      });
    }

    const ledgerIds = [localSalesLedgerId, centralSalesLedgerId, igstLedgerId, cgstLedgerId, sgstLedgerId, cessLedgerId];
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

    // Enforce Sales only for this module
    if (natureOfTransaction !== 'Sales') {
      return res.status(400).json({
        success: false,
        message: 'This module only supports Sales transactions. Purchase transactions should be handled separately.'
      });
    }

    if (!['Taxable', 'Exempted', 'Nil Rated', 'Zero Rated'].includes(taxability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid taxability status'
      });
    }

    const saleMasterData = {
      salesType: salesType.trim(),
      localSalesLedgerId,
      centralSalesLedgerId,
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

    const saleMaster = await SaleMaster.create(saleMasterData);

    const createdSaleMaster = await SaleMaster.findByPk(saleMaster.id, {
      include: [
        { model: Ledger, as: 'localSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Sale master created successfully',
      data: createdSaleMaster
    });

  } catch (error) {
    console.error('Sale master creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sale master',
      error: error.message
    });
  }
};

const getSaleMaster = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      taxability,
      status,
      isActive
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {
      natureOfTransaction: 'Sales'
    };

    if (search) {
      whereClause[Op.and] = [
        { natureOfTransaction: 'Sales' },
        { salesType: { [Op.iLike]: `%${search}%` } }
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

    const { count, rows } = await SaleMaster.findAndCountAll({
      where: whereClause,
      include: [
        { model: Ledger, as: 'localSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ],
      order: [['sortOrder', 'ASC'], ['salesType', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      message: 'Sale masters retrieved successfully',
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get sale masters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sale masters',
      error: error.message
    });
  }
};

const getSaleMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    const saleMaster = await SaleMaster.findByPk(id, {
      include: [
        { model: Ledger, as: 'localSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    if (!saleMaster) {
      return res.status(404).json({
        success: false,
        message: 'Sale master not found'
      });
    }

    res.json({
      success: true,
      message: 'Sale master retrieved successfully',
      data: saleMaster
    });

  } catch (error) {
    console.error('Get sale master by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sale master',
      error: error.message
    });
  }
};

const updateSaleMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      salesType,
      localSalesLedgerId,
      centralSalesLedgerId,
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

    const saleMaster = await SaleMaster.findByPk(id);
    if (!saleMaster) {
      return res.status(404).json({
        success: false,
        message: 'Sale master not found'
      });
    }

    if (saleMaster.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default sale masters cannot be edited'
      });
    }

    if (salesType && salesType !== saleMaster.salesType) {
      const existingSaleMaster = await SaleMaster.findOne({
        where: { 
          salesType: { [Op.iLike]: salesType },
          id: { [Op.ne]: id }
        }
      });

      if (existingSaleMaster) {
        return res.status(400).json({
          success: false,
          message: 'Sale type already exists'
        });
      }
    }

    if (localSalesLedgerId || centralSalesLedgerId || igstLedgerId || 
        cgstLedgerId || sgstLedgerId || cessLedgerId) {
      const ledgerIds = [
        localSalesLedgerId || saleMaster.localSalesLedgerId,
        centralSalesLedgerId || saleMaster.centralSalesLedgerId,
        igstLedgerId || saleMaster.igstLedgerId,
        cgstLedgerId || saleMaster.cgstLedgerId,
        sgstLedgerId || saleMaster.sgstLedgerId,
        cessLedgerId || saleMaster.cessLedgerId
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

    if (natureOfTransaction && natureOfTransaction !== 'Sales') {
      return res.status(400).json({
        success: false,
        message: 'This module only supports Sales transactions. Purchase transactions should be handled separately.'
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
    
    if (salesType !== undefined) updateData.salesType = salesType.trim();
    if (localSalesLedgerId !== undefined) updateData.localSalesLedgerId = localSalesLedgerId;
    if (centralSalesLedgerId !== undefined) updateData.centralSalesLedgerId = centralSalesLedgerId;
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

    await saleMaster.update(updateData);

    const updatedSaleMaster = await SaleMaster.findByPk(id, {
      include: [
        { model: Ledger, as: 'localSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'centralSalesLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'igstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'sgstLedger', attributes: ['id', 'ledgerName'] },
        { model: Ledger, as: 'cessLedger', attributes: ['id', 'ledgerName'] }
      ]
    });

    res.json({
      success: true,
      message: 'Sale master updated successfully',
      data: updatedSaleMaster
    });

  } catch (error) {
    console.error('Update sale master error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update sale master',
      error: error.message
    });
  }
};

const deleteSaleMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const saleMaster = await SaleMaster.findByPk(id);
    if (!saleMaster) {
      return res.status(404).json({
        success: false,
        message: 'Sale master not found'
      });
    }

    if (saleMaster.isDefault) {
      return res.status(403).json({
        success: false,
        message: 'Default sale masters cannot be deleted'
      });
    }

    await saleMaster.destroy();

    res.json({
      success: true,
      message: 'Sale master deleted successfully'
    });

  } catch (error) {
    console.error('Delete sale master error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete sale master',
      error: error.message
    });
  }
};

module.exports = {
  createSaleMaster,
  getSaleMaster,
  getSaleMasterById,
  updateSaleMaster,
  deleteSaleMaster
}; 