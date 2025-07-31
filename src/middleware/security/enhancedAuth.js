const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const tokenBlacklist = new Set();

const activeSessions = new Map();

const generateToken = (user, type = 'access') => {
  const payload = {
    id: user.id,
    username: user.uname,
    role: user.role,
    type: type,
    jti: uuidv4(),
    iat: Math.floor(Date.now() / 1000),
    exp: type === 'access' 
      ? Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      : Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    issuer: 'pharmacy-api',
    audience: 'pharmacy-client'
  });
};

const generateRefreshToken = (user) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  activeSessions.set(user.id, {
    refreshTokenHash: hashedToken,
    createdAt: new Date(),
    lastUsed: new Date(),
    userAgent: user.userAgent || 'unknown',
    ip: user.ip || 'unknown'
  });

  return refreshToken;
};

const verifyToken = (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
        code: 'TOKEN_MISSING'
      });
    }

    token = authHeader.split(" ")[1];

    if (tokenBlacklist.has(token)) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked",
        code: 'TOKEN_REVOKED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'pharmacy-api',
      audience: 'pharmacy-client'
    });

    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: "Invalid token type",
        code: 'INVALID_TOKEN_TYPE'
      });
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      jti: decoded.jti
    };

    req.tokenInfo = {
      jti: decoded.jti,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        code: 'INVALID_TOKEN'
      });
    } else {
      console.error('Token verification error:', error);
      return res.status(500).json({
        success: false,
        message: "Token verification failed",
        code: 'TOKEN_VERIFICATION_ERROR'
      });
    }
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        code: 'REFRESH_TOKEN_MISSING'
      });
    }

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    let session = null;
    let userId = null;

    for (const [id, sessionData] of activeSessions.entries()) {
      if (sessionData.refreshTokenHash === hashedToken) {
        session = sessionData;
        userId = id;
        break;
      }
    }

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    const tokenAge = Date.now() - session.createdAt.getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000;

    if (tokenAge > maxAge) {
      activeSessions.delete(userId);
      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }

    const db = require('../../database');
const { User } = db;
    const user = await User.findByPk(userId);

    if (!user) {
      activeSessions.delete(userId);
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: 'USER_NOT_FOUND'
      });
    }

    session.lastUsed = new Date();
    activeSessions.set(userId, session);

    const newAccessToken = generateToken(user, 'access');

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        expiresIn: 24 * 60 * 60
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      code: 'REFRESH_ERROR'
    });
  }
};

const logout = (req, res) => {
  try {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      tokenBlacklist.add(token);
      
      if (req.user && req.user.id) {
        activeSessions.delete(req.user.id);
      }
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};

const checkSession = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next();
  }

  const session = activeSessions.get(req.user.id);
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Session not found",
      code: 'SESSION_NOT_FOUND'
    });
  }

  const lastUsed = session.lastUsed.getTime();
  const now = Date.now();
  const maxInactivity = 24 * 60 * 60 * 1000;

  if (now - lastUsed > maxInactivity) {
    activeSessions.delete(req.user.id);
    return res.status(401).json({
      success: false,
      message: "Session expired due to inactivity",
      code: 'SESSION_EXPIRED'
    });
  }

  session.lastUsed = new Date();
  activeSessions.set(req.user.id, session);

  next();
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        code: 'AUTHENTICATION_REQUIRED'
      });
    }

    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
      manager: ['read', 'write', 'manage_inventory'],
      user: ['read', 'write']
    };

    const userPermissions = permissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredPermission: permission,
        userPermissions: userPermissions
      });
    }

    next();
  };
};

const authRateLimit = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many authentication attempts",
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
};

const cleanupExpiredSessions = () => {
  const now = Date.now();
  const maxSessionAge = 30 * 24 * 60 * 60 * 1000;
  const maxTokenAge = 60 * 60 * 1000;

  for (const [userId, session] of activeSessions.entries()) {
    if (now - session.createdAt.getTime() > maxSessionAge) {
      activeSessions.delete(userId);
    }
  }

  console.log(`Cleaned up expired sessions. Active sessions: ${activeSessions.size}`);
};

setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  refreshToken,
  logout,
  checkSession,
  authorizeRole,
  authorizePermission,
  authRateLimit,
  cleanupExpiredSessions,
  activeSessions,
  tokenBlacklist
};