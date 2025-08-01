const db = require('../../../models');
const Salt = db.Salt;
const SaltVariation = db.SaltVariation;
const sequelize = db.sequelize;
const { buildQueryOptions } = require('../../../utils/queryOptions');


// A. Create Salt

const createSalt = async (req, res) => {
  const { saltData, variationData } = req.body;

  try {
    const result = await sequelize.transaction(async (t) => {
      // Step 1: Create the salt entry
      const salt = await Salt.create(saltData, { transaction: t });

      // Step 2: Attach salt_id to each variation
      const variations = variationData.map((variation) => ({
        ...variation,
        salt_id: salt.id,
      }));

      // Step 3: Bulk create all variations linked to the salt
      await SaltVariation.bulkCreate(variations, { transaction: t });

      // Step 4: Return the complete nested salt with variations
      const fullSalt = await Salt.findOne({
        where: { id: salt.id },
        include: [
          {
            model: SaltVariation,
            as: "saltvariations", // make sure this matches your association alias
          },
        ],
        transaction: t,
      });

      return fullSalt;
    });

    return res.status(201).json({
      message: "Salt and its variations created successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error in createSalt:", error);

    return res.status(500).json({
      error: "Failed to create salt with variations.",
      details: error.message,
    });
  }
};


// B. Get All salt

const getSalt = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ['saltname'],
      [] 
    );
    const { count, rows } = await Salt.findAndCountAll({
      where,
      offset,
      limit,
      order,
      include: {
        model: SaltVariation,
        as: 'saltvariations',
        attributes: ["str","brandname","dosage","packsize","mrp","dpco","dpcomrp"]
      }
    });
    res.status(200).json({
      data: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// C. Get Slats by Id

const getSaltById = async (req, res) => {
  try {
    const { id } = req.params;
    const salt = await Salt.findByPk(id,{
        include:{
        model:SaltVariation,
        as:"saltvariations",
        attributes:["str","brandname","dosage","packsize","mrp","dpco","dpcomrp"]
      }
    });
    
    if (!salt) {
      return res.status(200).json({
        success: false,
        message: `Salt with ID ${id} not found`,
      });
    }
    res.status(200).json(salt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// D. Update Salt

const updateSalt = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(200).json({
      success: false,
      message: "Salt ID is required",
    });
  }

  try {
    const salt = await Salt.findByPk(id);
    if (!salt) {
      return res.status(200).json({
        success: false,
        message: "Salt not found",
      });
    }

    await salt.update(req.body);
    res.status(200).json({
      success: true,
      message: "Salt updated successfully",
      data: salt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating salt",
      error: error.message,
    });
  }
};

// E. Delete Salt

const deleteSalt = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(200).json({ message: "Salt Id Required" });
  try {
    const salt = await Salt.findByPk(id);
    await salt.destroy();
    res.status(200).json({
      success: true,
      message: "Salt deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting salt",
      error: error.message,
    });
  }
};

module.exports = {
  createSalt,
  getSalt,
  getSaltById,
  updateSalt,
  deleteSalt,
};
