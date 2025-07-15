const StoreMaster = require("../../../model/masters/inventory/store");

// A. Add Store
const createStore = async (req, res) => {
  try {
    const store = await StoreMaster.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating store",
      error: error.message,
    });
  }
};

// B. Get All Stores
const getStores = async (req, res) => {
  try {
    const stores = await StoreMaster.findAll();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving stores error: ${error}`,
    });
  }
};

// Get Store By Id

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await StoreMaster.findByPk(id);
    if (!store)
      return res.status(404).json({ message: `Store with id ${id} not found` });
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving stores error: ${error}`,
    });
  }
};

// C. Update Store from Store Id
const updateStore = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({message: "Store ID is required"});
  try {
    const store = await StoreMaster.findByPk(id);
    if (!store) return res.status(404).json({ message: `Store with ${id} not found` });
    await store.update(req.body);
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({
      message: `Error updating stores error: ${error}`,
    });
  }
};

// D. Delete Store from Store Id
const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await StoreMaster.findByPk(id);
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
