const db = require("../../../database/index");
const { buildQueryOptions } = require("../../../utils/queryOptions");
const Station = db.Station;

exports.createStation = async (req, res) => {
  try {
    const { name } = req.body;
    const userCompanyId = req.companyId;

    const existingStation = await Station.findOne({
      where: { name, userCompanyId },
    });
    if (existingStation) {
      return res.status(400).json({ message: "Station already exists" });
    }
    if (name === "" || name === undefined || name === null) {
      return res.status(400).json({ message: "name cannot be empty" });
    }
    const station = await Station.create({ name, userCompanyId });
    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStations = async (req, res) => {
  try {
    const {
      where,
      offset = 0,
      limit = 10,
      order,
      page,
    } = buildQueryOptions(req.query, ["name"], ["id", "name"]);
    const { count, rows: stations } = await Station.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
    res.status(200).json({
      data: stations || [],
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const station = await Station.update({ name }, { where: { id } });
    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    await Station.destroy({ where: { id } });
    res.status(200).json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStationById = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findByPk(id);
    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
