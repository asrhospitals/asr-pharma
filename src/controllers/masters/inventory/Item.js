const db = require("../../../database/index");
const Item = db.Item;
const { buildQueryOptions } = require("../../../utils/queryOptions");

const createItem = async (req, res) => {
  try {
    const {
      productname,
      unit1,
      unit2,
      hsnsac,
      taxcategory,
      company,
      price,
      purchasePrice,
      cost,
      salerate,
    } = req.body;
    
    // Use company from body if provided, otherwise use req.companyId from header
    const userCompanyId = req.companyId;

    if (!productname || !unit1 || !hsnsac || !taxcategory || !userCompanyId) {
      return res.status(400).json({
        success: false,
        message:
          "productname, unit1, hsnsac, taxcategory, and company are required",
      });
    }

    const unit1Exists = await db.Unit.findByPk(unit1);
    const unit2Exists = unit2 ? await db.Unit.findByPk(unit2) : null;
    const hsnsacExists = await db.HSN.findByPk(hsnsac);
    const companyExists = await db.Company.findByPk(company);

    console.log("Validation checks:", {
      unit1Exists: !!unit1Exists,
      hsnsacExists: !!hsnsacExists,
      companyExists: !!companyExists,
      unit1,
      hsnsac,
      company,
    });

    if (!unit1Exists || !hsnsacExists || !companyExists) {
      return res.status(400).json({
        success: false,
        message: `Foreign key validation failed - unit1: ${!!unit1Exists}, hsnsac: ${!!hsnsacExists}, company: ${!!companyExists}`,
      });
    }

    const existingItem = await Item.findOne({
      where: { productname, userCompanyId },
    });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "productname already exists",
      });
    }

    // Sanitize numeric fields - convert empty strings to null
    const itemData = { ...req.body, userCompanyId };
    const numericFields = [
      'price', 'purchasePrice', 'conversion', 'cost', 'salerate',
      'itemdiscount', 'maxdiscount', 'minimumquantity', 'maximumquantity',
      'recorderdays', 'recorderquantity', 'minimummargin'
    ];
    
    numericFields.forEach(field => {
      if (itemData[field] === '' || itemData[field] === undefined) {
        itemData[field] = null;
      }
    });


    const newItem = await Item.create(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const userCompanyId = req.companyId;
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ["productname"],
      ["status", "company"],
      userCompanyId
    );
    const { count, rows } = await Item.findAndCountAll({
      where,
      include: [
        { model: db.Unit, as: "Unit1" },
        { model: db.Unit, as: "Unit2" },
        { model: db.HSN, as: "HsnSacDetail" },
        { model: db.Company, as: "CompanyDetails" },
        { model: db.Salt, as: "SaltDetail" },
        { model: db.Rack, as: "RackDetail" },
        { model: db.PurchaseMaster, as: "TaxCategoryDetail" },
      ],
      attributes: {
        exclude: [
          "company",
          "hsnsac",
          "salt",
          "rack",
          "taxcategory",
          "unit1",
          "unit2",
        ],
      },
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
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
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

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    const userCompanyId = req.companyId;

    const item = await Item.findOne({
      where: { id, userCompanyId }
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Validate foreign keys if provided
    if (itemData.unit1) {
      const unit1Exists = await db.Unit.findByPk(itemData.unit1);
      if (!unit1Exists) {
        return res.status(400).json({ error: "Invalid unit1" });
      }
    }

    if (itemData.unit2) {
      const unit2Exists = await db.Unit.findByPk(itemData.unit2);
      if (!unit2Exists) {
        return res.status(400).json({ error: "Invalid unit2" });
      }
    }

    if (itemData.hsnsac) {
      const hsnsacExists = await db.HSN.findByPk(itemData.hsnsac);
      if (!hsnsacExists) {
        return res.status(400).json({ error: "Invalid hsnsac" });
      }
    }

    if (itemData.taxcategory) {
      const taxcategoryExists = await db.PurchaseMaster.findByPk(itemData.taxcategory);
      if (!taxcategoryExists) {
        return res.status(400).json({ error: "Invalid taxcategory" });
      }
    }

    const updatedItem = await item.update(itemData);
    
    const fullItem = await Item.findByPk(id, {
      include: [
        { model: db.Unit, as: "Unit1" },
        { model: db.Unit, as: "Unit2" },
        { model: db.HSN, as: "HsnSacDetail" },
        { model: db.Company, as: "CompanyDetails" },
        { model: db.Salt, as: "SaltDetail" },
        { model: db.Rack, as: "RackDetail" },
        { model: db.PurchaseMaster, as: "TaxCategoryDetail" },
      ],
    });

    res.status(200).json(fullItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByPk(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    await deletedItem.destroy();
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};
