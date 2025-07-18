const Item=require('../../../model/masters/inventory/item');



// A. Add Item


const createItem=async (req, res) => {
    try {
        const itemData = req.body;
        const newItem = await Item.create(itemData);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// B. Get All Items

const getItems=async (req, res) => {
    try {
        const items = await Item.findAll();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}

// Get Items by id

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
      // Check if company exists
    if (!item) {
      return res.status(200).json({
        success: false,
        message: `Item with ID ${id} not found`,
      });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// C. Update Item from Item Id

const updateItem=async (req, res) => {
    try {
        const { id } = req.params;
        const itemData = req.body;
        const updatedItem = await Item.findByIdAndUpdate(id, itemData, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


// D. Delete Item from Item Id
const deleteItem=async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await Item.findByPk(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        await deletedItem.destroy();
        res.status(200).json({
            success: true,
            message: 'Item deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
}


module.exports = {
    createItem,
    getItems,
    getItemById,
    updateItem,
    deleteItem
};
