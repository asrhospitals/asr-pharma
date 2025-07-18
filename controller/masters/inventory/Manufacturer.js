const Manufacturer = require("../../../model/masters/inventory/manufacturer");

// A. Create a new manufacturer
const addManufacturer = async (req, res) => {
  try {
    const newManufacturer = await Manufacturer.create(req.body);
    res.status(201).json(newManufacturer);
  } catch (error) {
    res.status(500).json({ message: "Error creating manufacturer", error });
  }
};

// B. Get all manufacturers
const getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.findAll();
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching manufacturers", error });
  }
};


// Get Manufactures By ID

const getManuById = async (req, res) => {
  try {
    const { id } = req.params;
    const manu = await Manufacturer.findByPk(id);
      // Check if company exists
    if (!manu) {
      return res.status(200).json({
        success: false,
        message: `Manufacture with ID ${id} not found`,
      });
    }
    res.status(200).json(manu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// C. Update a manufacturer by ID
const updateManufacturer = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Manufacturer ID is required" });
  try {
    const updateManufacturer = await Manufacturer.findByPk(id);
    if (!updateManufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    await updateManufacturer.update(req.body);
    res.status(200).json(updateManufacturer);
  } catch (error) {
    res.status(500).json({ message: "Error updating manufacturer", error });
  }
};


// D. Delete a manufacturer by ID
const deleteManufacturer = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Manufacturer ID is required" });
  try {
    const manufacturer = await Manufacturer.findByPk(id);
    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    await manufacturer.destroy();
    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting manufacturer", error });
  }
};


module.exports = {
  addManufacturer,
  getAllManufacturers,
  getManuById,
  updateManufacturer,
  deleteManufacturer,
};