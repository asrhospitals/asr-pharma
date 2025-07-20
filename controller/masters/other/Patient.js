const Patient = require("../../../model/masters/other/patient");
const { buildQueryOptions } = require("../../../utils/queryOptions");

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ["name", "email", "phone", "code"],
      []
    );
    const { count, rows: patients } = await Patient.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
    res.status(200).json({
      data: patients || [],
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(200).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePatient = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Patient ID is required",
    });
  }

  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(200).json({
        success: false,
        message: "Patient not found",
      });
    }

    await patient.update(req.body);
    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating patient",
      error: error.message,
    });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(200).json({
        success: false,
        message: "Patient not found",
      });
    }
    await patient.destroy();
    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting patient",
      error: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
