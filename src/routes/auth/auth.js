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


router.route('/send-otp')
  .post(
    authLimiter,
    sendPhoneOTP
  );

router.route('/verify-otp')
  .post(
    authLimiter,
    verifyPhoneOTP
  );


router.route('/signup')
  .post(
    authLimiter,
    validateUserRegistration,
    register
  );

router.route('/verify-email')
  .post(
    authLimiter,
    verifyEmail
  );

router.route('/resend-verification')
  .post(
    authLimiter,
    resendEmailVerification
  );


router.route('/signin')
  .post(
    authLimiter,
    bruteForceLimiter,
    validateUserLogin,
    login
  );

router.route('/refresh')
  .post(
    authLimiter,
    refreshToken
  );

router.route('/logout')
  .post(
    verifyToken,
    logout
  );


router.route('/profile')
  .get(
    verifyToken,
    getProfile
  )
  .put(
    verifyToken,
    updateProfile
  );

router.route('/change-password')
  .post(
    verifyToken,
    changePassword
  );


router.route('/switch-company')
  .post(
    verifyToken,
    switchCompany
  );

module.exports = router;