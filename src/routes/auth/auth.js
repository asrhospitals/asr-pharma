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


router.route('/signup')
  .post(
    authLimiter,
    validateUserRegistration,
    register
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
    logout
  );


router.route('/health')
  .get((req, res) => {
    res.json({
      success: true,
      message: 'Authentication service is healthy',
      timestamp: new Date().toISOString()
    });
  });

module.exports = router;