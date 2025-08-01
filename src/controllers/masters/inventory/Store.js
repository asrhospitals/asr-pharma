const db = require('../../../database/index');
const Store = db.Store;
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
  try {
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
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
