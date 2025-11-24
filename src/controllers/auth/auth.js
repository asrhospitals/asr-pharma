const db = require("../../database");
const User = db.User;
const Company = db.Company;
const UserCompany = db.UserCompany;
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  generateToken,
  generateRefreshToken,
} = require("../../middleware/security/enhancedAuth");
const securityConfig = require("../../config/security");
const verificationService = require("../../services/verificationService");
const otpModel = db.Otp;

const sendPhoneOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
        code: "PHONE_REQUIRED",
      });
    }

    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered",
        code: "PHONE_ALREADY_EXISTS",
      });
    }

    const otp = verificationService.generatePhoneOTP();
    const expiry = verificationService.calculateExpiry("phone");

    await otpModel.create({
      phone,
      otp,
      expiry: expiry,
    });

    const { otp: sentOtp } = await verificationService.sendPhoneOTP(phone, otp);

    console.log(`OTP sent to ${phone}: ${sentOtp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp: sentOtp,
      data: {
        phone,
        expiresIn: "15 minutes",
      },
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      code: "OTP_SEND_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
        code: "PHONE_OTP_REQUIRED",
      });
    }

    const storedVerification = await otpModel.findOne({
      where: { phone, otp },
      order: [["expiry", "DESC"]],
    });

    const verification = verificationService.verifyPhoneOTP(
      storedVerification.otp,
      storedVerification.expiry,
      otp
    );

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message,
        code: "OTP_VERIFICATION_FAILED",
      });
    }

    res.status(200).json({
      success: true,
      message: "Phone verified successfully",
      data: {
        phone,
        verified: true,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      code: "OTP_VERIFICATION_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const register = async (req, res) => {
  try {
    const { phone, email, pin, password, firstName, lastName } = req.body;

    const phoneVerification = await otpModel.findOne({
      where: { phone },
      order: [["expiry", "DESC"]],
    });
    if (!phoneVerification || phoneVerification.phone !== phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be verified first",
        code: "PHONE_NOT_VERIFIED",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { phone: phone }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email already exists"
            : "Phone number already exists",
        code: "USER_ALREADY_EXISTS",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const emailCode = verificationService.generateEmailCode();
    const emailExpiry = verificationService.calculateExpiry("email");

    const newUser = await User.create({
      phone: phone,
      email: email,
      pin: pin,
      pwd: hashedPassword,
      fname: firstName,
      lname: lastName,
      uname: email.split("@")[0] + "_" + Date.now(),
      role: "user",
      module: ["basic"],
      isactive: "pending_verification",
      phoneVerified: true,
      emailVerified: false,
      emailVerificationCode: emailCode,
      emailVerificationExpiry: emailExpiry,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`User registered: ${newUser}`);

    await verificationService.sendVerificationEmail(
      email,
      emailCode,
      `${firstName} ${lastName}`
    );

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      data: {
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        status: "pending_email_verification",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      code: "REGISTRATION_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
        code: "VERIFICATION_CODE_REQUIRED",
      });
    }

    const user = await User.findOne({
      where: {
        emailVerificationCode: code,
        emailVerified: false,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
        code: "INVALID_VERIFICATION_CODE",
      });
    }

    if (new Date() > new Date(user.emailVerificationExpiry)) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
        code: "VERIFICATION_CODE_EXPIRED",
      });
    }

    await user.update({
      emailVerified: true,
      isactive: "active",
      emailVerificationCode: null,
      emailVerificationExpiry: null,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now sign in.",
      data: {
        userId: user.id,
        email: user.email,
        status: "active",
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
      code: "EMAIL_VERIFICATION_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const login = async (req, res) => {
  try {
    const { loginType, uname, email, phone, pwd } = req.body;

    const whereClause =
      loginType === "username"
        ? { uname: uname }
        : loginType === "email"
        ? { email: email }
        : { phone: phone };

    const user = await User.findOne({
      where: whereClause,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const userCompanies = await UserCompany.findAll({
      where: { userId: user.id },
    });

    if (user.isactive !== "active") {
      return res.status(401).json({
        success: false,
        message:
          user.isactive === "pending_verification"
            ? "Please verify your email before signing in"
            : "Account is deactivated",
        code:
          user.isactive === "pending_verification"
            ? "EMAIL_NOT_VERIFIED"
            : "ACCOUNT_DEACTIVATED",
      });
    }

    const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
        code: "INVALID_PASSWORD",
      });
    }

    await user.update({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });

    const accessToken = generateToken(user, "access");
    const refreshToken = generateRefreshToken({
      ...user.toJSON(),
      userAgent: req.headers["user-agent"],
      ip: req.ip,
    });

    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      lastLoginAt: user.lastLoginAt,
      companies: userCompanies || [],
      activeCompany: user.activeCompany,
      currentCompany: userCompanies.find((company) => company.isPrimary === true),
    };

    if (process.env.NODE_ENV === "production") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: securityConfig.jwt.refreshTokenExpiry * 1000,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        accessToken,
        refreshToken:
          process.env.NODE_ENV === "production" ? undefined : refreshToken,
        expiresIn: securityConfig.jwt.accessTokenExpiry,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      code: "LOGIN_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: UserCompany,
          as: "companies",
          through: { attributes: ["role", "permissions"] },
        },
        {
          model: Company,
          as: "activeCompany",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      lastLoginAt: user.lastLoginAt,
      companies: user.companies || [],
      activeCompany: user.activeCompany,
    };

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      code: "GET_PROFILE_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
          code: "EMAIL_ALREADY_EXISTS",
        });
      }
    }

    await user.update({
      fname: firstName || user.fname,
      lname: lastName || user.lname,
      email: email || user.email,
      updatedAt: new Date(),
    });

    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      code: "UPDATE_PROFILE_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
        code: "PASSWORDS_REQUIRED",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.pwd
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        code: "INVALID_CURRENT_PASSWORD",
      });
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await user.update({
      pwd: hashedNewPassword,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      code: "CHANGE_PASSWORD_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const switchCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
        code: "COMPANY_ID_REQUIRED",
      });
    }

    const userCompany = await UserCompany.findOne({
      where: {
        userId,
        companyId,
        isActive: true,
      },
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this company",
        code: "COMPANY_ACCESS_DENIED",
      });
    }

    await User.update(
      { activeCompanyId: companyId, updatedAt: new Date() },
      { where: { id: userId } }
    );

    res.status(200).json({
      success: true,
      message: "Active company switched successfully",
      data: { activeCompanyId: companyId },
    });
  } catch (error) {
    console.error("Switch company error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to switch company",
      code: "SWITCH_COMPANY_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        code: "EMAIL_REQUIRED",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
        code: "EMAIL_ALREADY_VERIFIED",
      });
    }

    const emailCode = verificationService.generateEmailCode();
    const emailExpiry = verificationService.calculateExpiry("email");

    await user.update({
      emailVerificationCode: emailCode,
      emailVerificationExpiry: emailExpiry,
      updatedAt: new Date(),
    });

    await verificationService.sendVerificationEmail(
      email,
      emailCode,
      `${user.fname} ${user.lname}`
    );

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
      data: {
        email,
        expiresIn: "24 hours",
      },
    });
  } catch (error) {
    console.error("Resend email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
      code: "RESEND_EMAIL_ERROR",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

module.exports = {
  sendPhoneOTP,
  verifyPhoneOTP,
  register,
  verifyEmail,
  login,
  getProfile,
  updateProfile,
  changePassword,
  switchCompany,
  resendEmailVerification,
};
