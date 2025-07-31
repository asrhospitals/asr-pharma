const Router = require("express");
const { register, login } = require("../../controllers/auth/auth");
const { 
  authLimiter, 
  bruteForceLimiter,
  validateUserRegistration, 
  validateUserLogin,
  refreshToken,
  logout
} = require("../../middleware/security");

const router = Router();

// Create User (with enhanced security)
router.route('/signup')
  .post(
    authLimiter,
    validateUserRegistration,
    register
  );

// Log In User (with enhanced security)
router.route('/signin')
  .post(
    authLimiter,
    bruteForceLimiter,
    validateUserLogin,
    login
  );

// Refresh Token
router.route('/refresh')
  .post(
    authLimiter,
    refreshToken
  );

// Logout
router.route('/logout')
  .post(
    logout
  );

// Health check for auth service
router.route('/health')
  .get((req, res) => {
    res.json({
      success: true,
      message: 'Authentication service is healthy',
      timestamp: new Date().toISOString()
    });
  });

module.exports = router;