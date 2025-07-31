const db = require('../../database');
const User = db.User;
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const { 
  generateToken, 
  generateRefreshToken 
} = require('../../middleware/security/enhancedAuth');
const securityConfig = require('../../config/security');

// A. Register A User including Role (Enhanced Security)
const register = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, isActive = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { 
        $or: [
          { uname: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.uname === username 
          ? "Username already exists" 
          : "Email already exists",
        code: 'USER_ALREADY_EXISTS'
      });
    }

    // Enhanced password hashing with higher salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with enhanced security
    const newUser = await User.create({
      uname: username,
      email: email,
      pwd: hashedPassword,
      role: role || 'user',
      fname: firstName,
      lname: lastName,
      isactive: isActive,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate tokens
    const accessToken = generateToken(newUser, 'access');
    const refreshToken = generateRefreshToken({
      ...newUser.toJSON(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    // Remove sensitive data from response
    const userResponse = {
      id: newUser.id,
      username: newUser.uname,
      email: newUser.email,
      role: newUser.role,
      firstName: newUser.fname,
      lastName: newUser.lname,
      isActive: newUser.isactive,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
        expiresIn: securityConfig.jwt.accessTokenExpiry
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      code: 'REGISTRATION_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// B. Login a User (Enhanced Security)
const login = async (req, res) => {
  try {
    const { uname, pwd } = req.body;

    // Find user by username
    const user = await User.findOne({
      where: { uname: uname }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isactive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password with timing attack protection
    const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await user.update({
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });

    // Generate tokens
    const accessToken = generateToken(user, 'access');
    const refreshToken = generateRefreshToken({
      ...user.toJSON(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });

    // Remove sensitive data from response
    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      lastLoginAt: user.lastLoginAt
    };

    // Set secure cookie for refresh token (optional)
    if (process.env.NODE_ENV === 'production') {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: securityConfig.jwt.refreshTokenExpiry * 1000
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userResponse,
        accessToken,
        refreshToken: process.env.NODE_ENV === 'production' ? undefined : refreshToken,
        expiresIn: securityConfig.jwt.accessTokenExpiry
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      code: 'LOGIN_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// C. Get Current User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['pwd'] } // Exclude password
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: 'USER_NOT_FOUND'
      });
    }

    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt
    };

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      code: 'PROFILE_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// D. Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email, id: { $ne: userId } }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
          code: 'EMAIL_ALREADY_EXISTS'
        });
      }
    }

    // Update user
    await user.update({
      fname: firstName || user.fname,
      lname: lastName || user.lname,
      email: email || user.email,
      updatedAt: new Date()
    });

    const userResponse = {
      id: user.id,
      username: user.uname,
      email: user.email,
      role: user.role,
      firstName: user.fname,
      lastName: user.lname,
      isActive: user.isactive,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      code: 'UPDATE_PROFILE_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

// E. Change Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.pwd);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await user.update({
      pwd: hashedNewPassword,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      code: 'CHANGE_PASSWORD_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message })
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
