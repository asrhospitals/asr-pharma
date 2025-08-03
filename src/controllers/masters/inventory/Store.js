const db = require('../../../database/index');
const Store = db.Store;
const Rack = db.Rack;
const Item = db.Item;
const BillItem = db.BillItem;
const PrescriptionItem = db.PrescriptionItem;
const { buildQueryOptions } = require('../../../utils/queryOptions');


const createStore = async (req, res) => {
  try {
    const { storecode, storename, address1 } = req.body;
    if (!storecode || !storename || !address1) {
      return res.status(400).json({
        success: false,
        message: 'storecode, storename, and address1 are required',
      });
    }

    const existingStore = await Store.findOne({ where: { storename } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'storename already exists',
      });
    }
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating store",
      error: error.message,
    });
  }
};


const getStores = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ['storename'],
      [] 
    );
    const { count, rows } = await Store.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
    res.status(200).json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: `Error retrieving stores error: ${error}` });
  }
};



const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store)
      return res.status(404).json({ message: `Store with id ${id} not found` });
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving stores error: ${error}`,
    });
  }
};


const updateStore = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({message: "Store ID is required"});
  try {
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: `Store with ${id} not found` });
    await store.update(req.body);
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({
      message: `Error updating stores error: ${error}`,
    });
  }
};


const deleteStore = async (req, res) => {
  const { id } = req.params;
  const { cascade } = req.query;
  
  try {
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const relatedRacks = await Rack.findAll({ where: { storeid: id } });
    
    if (relatedRacks.length > 0) {
      if (cascade === 'true') {
        const rackIds = relatedRacks.map(rack => rack.id);
        
        const relatedItems = await Item.findAll({ where: { rack: rackIds } });
        const itemIds = relatedItems.map(item => item.id);
        
        let deletedBillItemsCount = 0;
        let deletedPrescriptionItemsCount = 0;
        
        if (itemIds.length > 0) {
          const relatedBillItems = await BillItem.findAll({ where: { itemId: itemIds } });
          if (relatedBillItems.length > 0) {
            await BillItem.destroy({ where: { itemId: itemIds } });
            deletedBillItemsCount = relatedBillItems.length;
          }
          
          const relatedPrescriptionItems = await PrescriptionItem.findAll({ where: { itemId: itemIds } });
          if (relatedPrescriptionItems.length > 0) {
            await PrescriptionItem.destroy({ where: { itemId: itemIds } });
            deletedPrescriptionItemsCount = relatedPrescriptionItems.length;
          }
          
          await Item.destroy({ where: { rack: rackIds } });
        }
        
        await Rack.destroy({ where: { storeid: id } });
        
        await store.destroy();
        
        return res.status(200).json({
          success: true,
          message: `Store, ${relatedRacks.length} rack(s), ${relatedItems.length} item(s), ${deletedBillItemsCount} bill item(s), and ${deletedPrescriptionItemsCount} prescription item(s) deleted successfully`,
          deletedRacksCount: relatedRacks.length,
          deletedItemsCount: relatedItems.length,
          deletedBillItemsCount,
          deletedPrescriptionItemsCount
        });
      } else {
        const rackIds = relatedRacks.map(rack => rack.id);
        const relatedItems = await Item.findAll({ where: { rack: rackIds } });
        const itemIds = relatedItems.map(item => item.id);
        
        let relatedBillItemsCount = 0;
        let relatedPrescriptionItemsCount = 0;
        
        if (itemIds.length > 0) {
          const relatedBillItems = await BillItem.findAll({ where: { itemId: itemIds } });
          const relatedPrescriptionItems = await PrescriptionItem.findAll({ where: { itemId: itemIds } });
          relatedBillItemsCount = relatedBillItems.length;
          relatedPrescriptionItemsCount = relatedPrescriptionItems.length;
        }
        
        return res.status(400).json({
          success: false,
          message: "Cannot delete store because it has related data",
          error: "Foreign key constraint violation",
          relatedRacksCount: relatedRacks.length,
          relatedItemsCount: relatedItems.length,
          relatedBillItemsCount,
          relatedPrescriptionItemsCount,
          suggestion: "Use ?cascade=true query parameter to delete store and all related data"
        });
      }
    }

    await store.destroy();
    res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting store",
      error: error.message,
    });
  }
};

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
};
