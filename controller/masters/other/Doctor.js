const Doctor = require('../../../model/masters/other/doctor');
const { buildQueryOptions } = require('../../../utils/queryOptions');

const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message,
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      [
        'name',
        'mobileNo',
        'registrationNo',
        'hospitalName',
        'specialization',
        'email',
        'phoneNo',
        'whatsappNo',
        'status',
      ],
      [
        'id',
        'name',
        'mobileNo',
        'registrationNo',
        'hospitalName',
        'specialization',
        'commission',
        'locationCode',
        'address',
        'pinNo',
        'phoneNo',
        'email',
        'whatsappNo',
        'status',
      ]
    );
    const { count, rows: doctors } = await Doctor.findAndCountAll({
      where,
      offset,
      limit,
      order,
    });
    res.status(200).json({
      data: doctors || [],
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(200).json({
        success: false,
        message: `Doctor with ID ${id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message,
    });
  }
};

const updateDoctor = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Doctor ID is required',
    });
  }
  try {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(200).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    await doctor.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message,
    });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(200).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    await doctor.destroy();
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message,
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
}; 