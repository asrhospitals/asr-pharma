const Router = require("express");
const { 
  sendPhoneOTP,
  verifyPhoneOTP,
  register, 
  verifyEmail,
  login,
  getProfile,
  updateProfile,
  changePassword,
  switchCompany,
  resendEmailVerification
} = require("../../controllers/auth/auth");
const { 
  authLimiter, 
  bruteForceLimiter,
  validateUserRegistration, 
  validateUserLogin,
  refreshToken,
  logout
} = require("../../middleware/security");
const { verifyToken } = require("../../middleware/security/enhancedAuth");

const router = Router();

/**
 * @swagger
 * /pharmacy/auth/send-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send OTP to phone
 *     description: Sends a one-time password to the user's phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 */
router.route('/send-otp')
  .post(
    authLimiter,
    sendPhoneOTP
  );

/**
 * @swagger
 * /pharmacy/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to user's phone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.route('/verify-otp')
  .post(
    authLimiter,
    verifyPhoneOTP
  );

/**
 * @swagger
 * /pharmacy/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User registration
 *     description: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - pwd
 *               - email
 *               - phone
 *               - fname
 *               - lname
 *             properties:
 *               uname:
 *                 type: string
 *                 example: "john_doe"
 *               pwd:
 *                 type: string
 *                 format: password
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.route('/signup')
  .post(
    authLimiter,
    validateUserRegistration,
    register
  );

/**
 * @swagger
 * /pharmacy/auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.route('/verify-email')
  .post(
    authLimiter,
    verifyEmail
  );

/**
 * @swagger
 * /pharmacy/auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 */
router.route('/resend-verification')
  .post(
    authLimiter,
    resendEmailVerification
  );

/**
 * @swagger
 * /pharmacy/auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user and get JWT tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uname
 *               - pwd
 *             properties:
 *               uname:
 *                 type: string
 *                 example: "admin"
 *               pwd:
 *                 type: string
 *                 format: password
 *                 example: "Admin@123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
router.route('/signin')
  .post(
    authLimiter,
    bruteForceLimiter,
    validateUserLogin,
    login
  );

/**
 * @swagger
 * /pharmacy/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh JWT token
 *     description: Get new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.route('/refresh')
  .post(
    authLimiter,
    refreshToken
  );

/**
 * @swagger
 * /pharmacy/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.route('/logout')
  .post(
    verifyToken,
    logout
  );

/**
 * @swagger
 * /pharmacy/auth/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.route('/profile')
  .get(
    verifyToken,
    getProfile
  )
  .put(
    verifyToken,
    updateProfile
  );

/**
 * @swagger
 * /pharmacy/auth/change-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Change password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.route('/change-password')
  .post(
    verifyToken,
    changePassword
  );

/**
 * @swagger
 * /pharmacy/auth/switch-company:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Switch active company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Company switched successfully
 */
router.route('/switch-company')
  .post(
    verifyToken,
    switchCompany
  );

module.exports = router;