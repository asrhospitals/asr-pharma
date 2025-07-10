const Company = require("../../../model/masters/inventory/company");

// A. Create a new company
const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// B. Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// C. Update company by ID
const updateCompany = async (req, res) => {  
    
    const {id}=req.params;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Company ID is required',
        });
    }
    
    try {
        const company = await Company.findByPk(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }

        await company.update(req.body);
        res.status(200).json({
            success: true,
            message: 'Company updated successfully',
            data: company,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating company',
            error: error.message,
        });
    }
};


// D. Delete Rack from Rack Id
const deleteCompany = async (req, res) => {    
    const { id } = req.params;
    try {
        const company = await Company.findByPk(id);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found',
            });
        }
        await company.destroy();
        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting company',
            error: error.message,
        });
    }
};  


module.exports = {
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany
};