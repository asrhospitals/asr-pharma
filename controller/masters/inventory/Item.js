const db = require('../../../models');
const Item = db.Item;
const { buildQueryOptions } = require('../../../utils/queryOptions');


// A. Add Item


const createItem = async (req, res) => {
    try {
        const {
            productname, unit1, unit2, hsnsac, taxcategory, company, price, purchasePrice, cost, salerate
        } = req.body;
        // Required fields
        if (!productname || !unit1 || !unit2 || !hsnsac || !taxcategory || !company) {
            return res.status(400).json({
                success: false,
                message: 'productname, unit1, unit2, hsnsac, taxcategory, and company are required',
            });
        }
        // Check foreign keys (unit1, unit2, hsnsac, company)
        const unit1Exists = await db.Unit.findByPk(unit1);
        const unit2Exists = await db.Unit.findByPk(unit2);
        const hsnsacExists = await db.HsnSac.findByPk(hsnsac);
        const companyExists = await db.Company.findByPk(company);
        if (!unit1Exists || !unit2Exists || !hsnsacExists || !companyExists) {
            return res.status(400).json({
                success: false,
                message: 'One or more foreign keys (unit1, unit2, hsnsac, company) do not exist',
            });
        }
        // Check for duplicate productname (optional, if you want uniqueness)
        const existingItem = await Item.findOne({ where: { productname } });
        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: 'productname already exists',
            });
        }
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// B. Get All Items

const getItems = async (req, res) => {
    try {
        const { where, offset, limit, order, page } = buildQueryOptions(
            req.query,
            ['name', 'description'],
            ['status', 'companyId']  
        );
        const { count, rows } = await Item.findAndCountAll({
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
