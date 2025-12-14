const db = require('../../database');
const { Batch, Item, UserCompany } = db;
const { Op } = require('sequelize');

const createBatch = async (req, res) => {
  try {
    const { itemId, batchNumber, quantity, expiryDate, mrp, purchaseRate, notes } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    if (!itemId || !batchNumber || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, batch number, and quantity are required'
      });
    }

    // Check if item exists
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if batch already exists for this item
    const existingBatch = await Batch.findOne({
      where: {
        itemId,
        batchNumber,
        userCompanyId
      }
    });

    if (existingBatch) {
      return res.status(409).json({
        success: false,
        message: 'Batch already exists for this item'
      });
    }

    const batch = await Batch.create({
      userCompanyId,
      itemId,
      batchNumber,
      quantity: parseFloat(quantity),
      expiryDate: expiryDate || null,
      mrp: mrp ? parseFloat(mrp) : null,
      purchaseRate: purchaseRate ? parseFloat(purchaseRate) : null,
      notes: notes || null,
      status: 'Active'
    });

    const batchWithItem = await Batch.findByPk(batch.id, {
      include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }]
    });

    return res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batchWithItem
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating batch',
      error: error.message
    });
  }
};

const getBatchesByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    const batches = await Batch.findAll({
      where: {
        itemId,
        userCompanyId,
        status: 'Active'
      },
      include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: batches
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching batches',
      error: error.message
    });
  }
};

const getAllBatches = async (req, res) => {
  try {
    const userCompanyId = req.companyId || req.user?.userCompanyId;
    const { itemId, status } = req.query;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    const where = { userCompanyId };
    if (itemId) where.itemId = itemId;
    if (status) where.status = status;

    const batches = await Batch.findAll({
      where,
      include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: batches
    });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching batches',
      error: error.message
    });
  }
};

const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    const batch = await Batch.findOne({
      where: { id, userCompanyId },
      include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }]
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error('Error fetching batch:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching batch',
      error: error.message
    });
  }
};

const updateBatchQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const batch = await Batch.findOne({
      where: { id, userCompanyId }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    batch.quantity = parseFloat(quantity);
    await batch.save();

    const updatedBatch = await Batch.findByPk(batch.id, {
      include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }]
    });

    return res.status(200).json({
      success: true,
      message: 'Batch quantity updated successfully',
      data: updatedBatch
    });
  } catch (error) {
    console.error('Error updating batch quantity:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating batch quantity',
      error: error.message
    });
  }
};

const moveBatchQuantity = async (req, res) => {
  try {
    const { fromBatchId, toBatchId, quantity } = req.body;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    if (!fromBatchId || !toBatchId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'From batch ID, to batch ID, and quantity are required'
      });
    }

    const quantityToMove = parseFloat(quantity);
    if (quantityToMove <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const fromBatch = await Batch.findOne({
      where: { id: fromBatchId, userCompanyId }
    });

    if (!fromBatch) {
      return res.status(404).json({
        success: false,
        message: 'Source batch not found'
      });
    }

    if (fromBatch.quantity < quantityToMove) {
      return res.status(400).json({
        success: false,
        message: `Insufficient quantity in source batch. Available: ${fromBatch.quantity}`
      });
    }

    const toBatch = await Batch.findOne({
      where: { id: toBatchId, userCompanyId }
    });

    if (!toBatch) {
      return res.status(404).json({
        success: false,
        message: 'Destination batch not found'
      });
    }

    if (fromBatch.itemId !== toBatch.itemId) {
      return res.status(400).json({
        success: false,
        message: 'Both batches must belong to the same item'
      });
    }

    // Move quantity
    fromBatch.quantity -= quantityToMove;
    toBatch.quantity += quantityToMove;

    await fromBatch.save();
    await toBatch.save();

    return res.status(200).json({
      success: true,
      message: 'Quantity moved successfully',
      data: {
        fromBatch: await Batch.findByPk(fromBatch.id, {
          include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }]
        }),
        toBatch: await Batch.findByPk(toBatch.id, {
          include: [{ model: Item, as: 'item', attributes: ['id', 'productname', 'packing'] }]
        })
      }
    });
  } catch (error) {
    console.error('Error moving batch quantity:', error);
    return res.status(500).json({
      success: false,
      message: 'Error moving batch quantity',
      error: error.message
    });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompanyId = req.companyId || req.user?.userCompanyId;

    if (!userCompanyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required'
      });
    }

    const batch = await Batch.findOne({
      where: { id, userCompanyId }
    });

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    if (batch.quantity > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete batch with remaining quantity. Move or consume the quantity first.'
      });
    }

    await batch.destroy();

    return res.status(200).json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting batch',
      error: error.message
    });
  }
};

module.exports = {
  createBatch,
  getBatchesByItem,
  getAllBatches,
  getBatchById,
  updateBatchQuantity,
  moveBatchQuantity,
  deleteBatch
};
