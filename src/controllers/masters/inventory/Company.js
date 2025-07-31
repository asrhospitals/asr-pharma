const db = require('../../../database/index');
const Company = db.Company;
const { buildQueryOptions } = require('../../../utils/queryOptions');

const createCompany = async (req, res) => {
  try {
    const { companyname } = req.body;
    if (!companyname) {
      return res.status(400).json({
        success: false,
        message: 'companyname is required',
      });
    }
    const existingCompany = await Company.findOne({ where: { companyname } });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'companyname already exists',
      });
    }
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ['companyname'],
      [] 
    );
    const { count, rows } = await Company.findAndCountAll({
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
    res.status(500).json({ error: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
      
    if (!company) {
      return res.status(200).json({
        success: false,
        message: `Company with ID ${id} not found`,
      });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Company ID is required",
    });
  }

  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(200).json({
        success: false,
        message: "Company not found",
      });
    }

    await company.update(req.body);
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating company",
      error: error.message,
    });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(200).json({
        success: false,
        message: "Company not found",
      });
    }
    await company.destroy();
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
