const db = require('../../../database/index');
const SaltVariation = db.SaltVariation;

// A. Create Salt Variations
const addVariations = async (req, res) => {
  try {
    const variation = await SaltVariation.create(req.body);
    res.status(201).json(variation);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};

// B. Get Salt Variations

const getVariations = async (req, res) => {
  try {
    const variation = await SaltVariation.findAll();
    res.status(200).json(variation);
  } catch (error) {
    res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};

// C. Update Salt Variations

const updateVariation = async (req, res) => {
  try {

    const id=req.params;
    const variation=await SaltVariation.findByPk(id);
    if(!variation) return res.status(200).json({message:"Salt Variation not found"});
    await variation.update(req.body);
  res.status(200).json({
      success: true,
      message: "Salt Variation updated successfully",
      data: variation,
    });
  } catch (error) {
    res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};

module.exports = {
  addVariations,
  getVariations,
  updateVariation
};
