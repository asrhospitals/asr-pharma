const db = require("../../database/index");
const {
  seedSalesMasters,
} = require("../../services/seeders/SalesMastersSeeder");
const { seedCompanyDefaults } = require("../../services/companySeeder");
const { seedGroups } = require("../../services/seeders/groupSeeder");
const User = db.User;
const UserCompany = db.UserCompany;
const sequelize = db.sequelize;
const { buildQueryOptions } = require("../../utils/queryOptions");

const createUserCompany = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      companyName,
      address,
      country = "India",
      state,
      pinCode,

      branchCode,
      businessType,
      calendarType = "English",
      financialYearFrom,
      financialYearTo,
      taxType = "GST",

      phone,
      website,
      email,

      companyRegType,
      panNumber,

      logoUrl,
    } = req.body;

    const userId = req.user.id;

    if (
      !companyName ||
      !address ||
      !state ||
      !pinCode ||
      !branchCode ||
      !businessType ||
      !financialYearFrom ||
      !financialYearTo
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Required fields missing: companyName, address, state, pinCode, branchCode, businessType, financialYearFrom, financialYearTo",
      });
    }

    const existingCompany = await UserCompany.findOne({
      where: { companyName, userId },
      transaction,
    });
    if (existingCompany) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Company name already exists",
      });
    }

    const userCompany = await UserCompany.create(
      {
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
        status: "active",
        userId,
        role: "owner",
        permissions: { all: true },
        isActive: true,
        joinedAt: new Date(),
      },
      { transaction }
    );

    console.log(`🌱 Seeding defaults for company ${userCompany.id}`);
    await seedCompanyDefaults(sequelize, userCompany.id, transaction);

    // ✅ Commit only if everything succeeds
    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: userCompany,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create company error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating company",
      error: error.message,
    });
  }
};

const getUserCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCompanies = await UserCompany.findAll({
      where: { userId, status: "active" },
    });

    res.status(200).json({
      success: true,
      data: userCompanies,
    });
  } catch (error) {
    console.error("Get user companies error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user companies",
      error: error.message,
    });
  }
};

const updateUserCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id || req.params.userId;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const userCompany = await UserCompany.findOne({
      where: { userId, companyId: id, isActive: true },
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    if (!["owner", "admin"].includes(userCompany.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this company",
      });
    }

    const company = await UserCompany.findByPk(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (
      updateData.companyName &&
      updateData.companyName !== company.companyName
    ) {
      const existingCompany = await Company.findOne({
        where: { companyName: updateData.companyName },
      });
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: "Company name already exists",
        });
      }
    }

    if (updateData.branchCode && updateData.branchCode !== company.branchCode) {
      const existingBranch = await UserCompany.findOne({
        where: { branchCode: updateData.branchCode },
      });
      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: "Branch code already exists",
        });
      }
    }

    const userCompanies = await UserCompany.findAll({
      where: { userId, status: "active" },
    });

    res.status(200).json({
      success: true,
      data: userCompanies,
    });
  } catch (error) {
    console.error("Get user companies error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user companies",
      error: error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const id = req.params.companyId;

    const company = await UserCompany.findByPk(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Get company by ID error:", error);
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
      where: { userId, companyId: id, isActive: true },
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    if (!["owner", "admin"].includes(userCompany.role)) {
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

    if (
      updateData.companyName &&
      updateData.companyName !== company.companyName
    ) {
      const existingCompany = await Company.findOne({
        where: { companyName: updateData.companyName },
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
        where: { branchCode: updateData.branchCode },
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
    console.error("Update company error:", error);
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
      where: { userId, companyId: id, isActive: true },
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
      });
    }

    if (userCompany.role !== "owner") {
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

    await company.update({ status: "inactive" });

    await UserCompany.update({ isActive: false }, { where: { companyId: id } });

    await User.update(
      { activeCompanyId: null },
      { where: { activeCompanyId: id } }
    );

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Delete company error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};

// const addUserToCompany = async (req, res) => {
//   try {
//     const { companyId } = req.params;
//     const { userEmail, role = 'user', permissions = {} } = req.body;
//     const currentUserId = req.user.id;

//     if (!companyId || !userEmail) {
//       return res.status(400).json({
//         success: false,
//         message: "Company ID and user email are required",
//       });
//     }

//     const currentUserCompany = await UserCompany.findOne({
//       where: { userId: currentUserId, companyId, isActive: true }
//     });

//     if (!currentUserCompany || !['owner', 'admin'].includes(currentUserCompany.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to add users to this company",
//       });
//     }

//     const user = await User.findOne({ where: { email: userEmail } });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const existingUserCompany = await UserCompany.findOne({
//       where: { userId: user.id, companyId, isActive: true }
//     });

//     if (existingUserCompany) {
//       return res.status(400).json({
//         success: false,
//         message: "User is already a member of this company",
//       });
//     }

//     await UserCompany.create({
//       userId: user.id,
//       companyId,
//       role,
//       permissions,
//       isActive: true,
//       joinedAt: new Date()
//     });

//     res.status(201).json({
//       success: true,
//       message: "User added to company successfully",
//       data: {
//         userId: user.id,
//         userEmail: user.email,
//         userName: `${user.fname} ${user.lname}`,
//         role,
//         permissions
//       }
//     });
//   } catch (error) {
//     console.error('Add user to company error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding user to company",
//       error: error.message,
//     });
//   }
// };

// const removeUserFromCompany = async (req, res) => {
//   try {
//     const { companyId, userId } = req.params;
//     const currentUserId = req.user.id;

//     if (!companyId || !userId) {
//       return res.status(400).json({
//         success: false,
//         message: "Company ID and user ID are required",
//       });
//     }

//     const currentUserCompany = await UserCompany.findOne({
//       where: { userId: currentUserId, companyId, isActive: true }
//     });

//     if (!currentUserCompany || !['owner', 'admin'].includes(currentUserCompany.role)) {
//       return res.status(403).json({
//         success: false,
//         message: "You don't have permission to remove users from this company",
//       });
//     }

//     const userToRemove = await UserCompany.findOne({
//       where: { userId, companyId, isActive: true }
//     });

//     if (!userToRemove) {
//       return res.status(404).json({
//         success: false,
//         message: "User is not a member of this company",
//       });
//     }

//     if (userToRemove.role === 'owner') {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot remove company owner",
//       });
//     }

//     await userToRemove.update({ isActive: false });

//     await User.update(
//       { activeCompanyId: null },
//       { where: { id: userId, activeCompanyId: companyId } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "User removed from company successfully",
//     });
//   } catch (error) {
//     console.error('Remove user from company error:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error removing user from company",
//       error: error.message,
//     });
//   }
// };

const getAllCompanies = async (req, res) => {
  try {
    const { where, offset, limit, order, page } = buildQueryOptions(
      req.query,
      ["companyName", "branchCode"],
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
    console.error("Get all companies error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
      error: error.message,
    });
  }
};

module.exports = {
  createUserCompany,
  getUserCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateUserCompany,
  //   addUserToCompany,
  //   removeUserFromCompany,
  getAllCompanies,
};
