const db = require("../../../database/index");
const Manufacturer = db.Manufacturer;
const { buildQueryOptions } = require("../../../utils/queryOptions");

const addManufacturer = async (req, res) => {
  try {
    const userCompanyId = req.companyId;
    const { manufacturername } = req.body;
    if (!manufacturername) {
      return res.status(400).json({
        success: false,
        message: "manufacturername is required",
      });
    }
    const existingManufacturer = await Manufacturer.findOne({
      where: { manufacturername, userCompanyId },
    });
    if (existingManufacturer) {
      return res.status(400).json({
        success: false,
        message: "manufacturername already exists",
      });
    }
    const newManufacturer = await Manufacturer.create({ ...req.body, userCompanyId });
    res.status(201).json(newManufacturer);
  } catch (error) {
    res.status(500).json({ message: "Error creating manufacturer", error });
  }
};

const getAllManufacturers = async (req, res) => {
  try {
    const userCompanyId = req.companyId;
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ["manufacturername"],
      [], 
      userCompanyId
    );
    const { count, rows } = await Manufacturer.findAndCountAll({
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
    res.status(500).json({ message: "Error fetching manufacturers", error });
  }
};

const getManuById = async (req, res) => {
  try {
    const { id } = req.params;
    const manu = await Manufacturer.findByPk(id);

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
