const db = require('../../../database/index');
const Company = db.Company;
const User = db.User;
const UserCompany = db.UserCompany;
const { buildQueryOptions } = require("../../../utils/queryOptions");


const createCompany = async (req, res) => {
  try {
    const {
      
      companyName,
      address,
      country = 'India',
      state,
      pinCode,
      
      
      branchCode,
      businessType,
      calendarType = 'English',
      financialYearFrom,
      financialYearTo,
      taxType = 'GST',
      
      
      phone,
      website,
      email,
      
      
      companyRegType,
      panNumber,
      
      
      logoUrl
    } = req.body;

    const userId = req.user.id;

    
    if (!companyName || !address || !state || !pinCode || !branchCode || !businessType || !financialYearFrom || !financialYearTo) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing: companyName, address, state, pinCode, branchCode, businessType, financialYearFrom, financialYearTo',
      });
    }

    
    const existingCompany = await Company.findOne({ where: { companyName } });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company name already exists',
      });
    }

    
    const existingBranch = await Company.findOne({ where: { branchCode } });
    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'Branch code already exists',
      });
    }

    
    const company = await Company.create({
      companyName,
      address,
      country,
      state,
      pinCode,
      branchCode,
      businessType,
      calendarType,
      financialYearFrom,
      financialYearTo,
      taxType,
      phone,
      website,
      email,
      companyRegType,
      panNumber,
      logoUrl,
      status: 'active'
    });

    
    await UserCompany.create({
      userId,
      companyId: company.id,
      role: 'owner',
      permissions: { all: true },
      isActive: true,
      joinedAt: new Date()
    });

    
    await User.update(
      { activeCompanyId: company.id },
      { where: { id: userId } }
    );

    
    const companyWithUsers = await Company.findByPk(company.id, {
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['role', 'permissions'] }
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: companyWithUsers
    });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating company',
      error: error.message,
    });
  }
};


const getUserCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCompanies = await UserCompany.findAll({
      where: { userId, isActive: true },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'companyName', 'branchCode', 'businessType', 'status', 'logoUrl']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: userCompanies.map(uc => ({
        id: uc.company.id,
        companyName: uc.company.companyName,
        branchCode: uc.company.branchCode,
        businessType: uc.company.businessType,
        status: uc.company.status,
        logoUrl: uc.company.logoUrl,
        role: uc.role,
        permissions: uc.permissions,
        joinedAt: uc.joinedAt
      }))
    });
  } catch (error) {
    console.error('Get user companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user companies',
      error: error.message,
    });
  }
};


const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    
    const userCompany = await UserCompany.findOne({
      where: { userId, companyId: id, isActive: true }
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    const company = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          through: { attributes: ['role', 'permissions', 'joinedAt'] }
        }
      ]
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    console.error('Get company by ID error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching company",
      error: error.message,
    });
  }
};


const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    
    const userCompany = await UserCompany.findOne({
      where: { userId, companyId: id, isActive: true }
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    if (!['owner', 'admin'].includes(userCompany.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this company",
      });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    
    if (updateData.companyName && updateData.companyName !== company.companyName) {
      const existingCompany = await Company.findOne({ 
        where: { companyName: updateData.companyName } 
      });
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: "Company name already exists",
        });
      }
    }

    
    if (updateData.branchCode && updateData.branchCode !== company.branchCode) {
      const existingBranch = await Company.findOne({ 
        where: { branchCode: updateData.branchCode } 
      });
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: "Branch code already exists",
        });
      }
    }

    await company.update(updateData);

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: "Error updating company",
      error: error.message,
    });
  }
};


const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    
    const userCompany = await UserCompany.findOne({
      where: { userId, companyId: id, isActive: true }
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    if (userCompany.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: "Only company owner can delete the company",
      });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    
    await company.update({ status: 'inactive' });

    
    await UserCompany.update(
      { isActive: false },
      { where: { companyId: id } }
    );

    
    await User.update(
      { activeCompanyId: null },
      { where: { activeCompanyId: id } }
    );

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};


const addUserToCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { userEmail, role = 'user', permissions = {} } = req.body;
    const currentUserId = req.user.id;

    if (!companyId || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Company ID and user email are required",
      });
    }

    
    const currentUserCompany = await UserCompany.findOne({
      where: { userId: currentUserId, companyId, isActive: true }
    });

    if (!currentUserCompany || !['owner', 'admin'].includes(currentUserCompany.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to add users to this company",
      });
    }

    
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    const existingUserCompany = await UserCompany.findOne({
      where: { userId: user.id, companyId, isActive: true }
    });

    if (existingUserCompany) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of this company",
      });
    }

    
    await UserCompany.create({
      userId: user.id,
      companyId,
      role,
      permissions,
      isActive: true,
      joinedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "User added to company successfully",
      data: {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.fname} ${user.lname}`,
        role,
        permissions
      }
    });
  } catch (error) {
    console.error('Add user to company error:', error);
    res.status(500).json({
      success: false,
      message: "Error adding user to company",
      error: error.message,
    });
  }
};


const removeUserFromCompany = async (req, res) => {
  try {
    const { companyId, userId } = req.params;
    const currentUserId = req.user.id;

    if (!companyId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Company ID and user ID are required",
      });
    }

    
    const currentUserCompany = await UserCompany.findOne({
      where: { userId: currentUserId, companyId, isActive: true }
    });

    if (!currentUserCompany || !['owner', 'admin'].includes(currentUserCompany.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to remove users from this company",
      });
    }

    
    const userToRemove = await UserCompany.findOne({
      where: { userId, companyId, isActive: true }
    });

    if (!userToRemove) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this company",
      });
    }

    if (userToRemove.role === 'owner') {
      return res.status(400).json({
        success: false,
        message: "Cannot remove company owner",
      });
    }

    
    await userToRemove.update({ isActive: false });

    
    await User.update(
      { activeCompanyId: null },
      { where: { id: userId, activeCompanyId: companyId } }
    );

    res.status(200).json({
      success: true,
      message: "User removed from company successfully",
    });
  } catch (error) {
    console.error('Remove user from company error:', error);
    res.status(500).json({
      success: false,
      message: "Error removing user from company",
      error: error.message,
    });
  }
};


const getAllCompanies = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ['companyName', 'branchCode'],
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
    console.error('Get all companies error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching companies",
      error: error.message 
    });
  }
};

module.exports = {
  createCompany,
  getUserCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  addUserToCompany,
  removeUserFromCompany,
  getAllCompanies
};
