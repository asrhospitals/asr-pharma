const StoreMaster=require('../../../model/masters/inventory/store');

// A. Add Store
const createStore = async (req, res) => {
    try {
        const store = await StoreMaster.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Store created successfully',
            data: store,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating store',
            error: error.message,
        });
    }
}

// B. Get All Stores
const getStores = async (req, res) => {
    try {
        const stores = await StoreMaster.findAll();
        if (stores.length === 0) {
            return res.status(404).json({
                message: 'No stores found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Stores retrieved successfully',
            data: stores,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving stores',
            error: error.message,
        });
    }
};


// C. Update Store from Store Id
const updateStore = async (req, res) => {   
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Store ID is required',
        });
    }
    try {
        const store = await StoreMaster.findByPk(id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        await store.update(req.body);
        res.status(200).json({
            success: true,
            message: 'Store updated successfully',
            data: store,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating store',
            error: error.message,
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
                message: 'Store not found',
            });
        }
        await store.destroy();
        res.status(200).json({
            success: true,
            message: 'Store deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting store',
            error: error.message,
        });
    }
};


module.exports = {
    createStore,
    getStores,
    updateStore,
    deleteStore,
};
   