require('dotenv').config();
const express = require("express");
const db = require("./database/index");
const sequelize = db.sequelize;

const {
  applySecurityMiddleware,
  applyRouteSpecificRateLimiting,
  securityErrorHandler,
  securityHealthCheck,
  verifyToken,
  authorizeRole,
  validateUserLogin,
  validateUserRegistration
} = require('./middleware/security');

const { 
  apiLogger, 
  setLoggingEnabled, 
  getLogConfig, 
  getLogStats,
  clearLogs 
} = require('./middleware/logging/apiLogger');

const MasterRoutes = require("./routes/master/masterroutes");
const AuthRoutes = require('./routes/auth/auth');
const salesBillRoutes = require('./routes/sales/billRoutes');
const accountRoutes = require('./routes/master/accountRoutes');
const groupRoutes = require('./routes/master/groupRoutes');
const ledgerEntryRoutes = require('./routes/master/ledgerEntryRoutes');
const purchaseMasterRoutes = require('./routes/master/purchaseMasterRoutes');

const app = express();
// comments for testing
applySecurityMiddleware(app, process.env.NODE_ENV || 'development');

app.use(apiLogger);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

applyRouteSpecificRateLimiting(app);

app.get('/pharmacy/security/health', securityHealthCheck);

app.get('/pharmacy/logs/config', (req, res) => {
  res.json({
    success: true,
    data: getLogConfig()
  });
});

app.post('/pharmacy/logs/enable', (req, res) => {
  setLoggingEnabled(true);
  res.json({
    success: true,
    message: 'API logging enabled'
  });
});

app.post('/pharmacy/logs/disable', (req, res) => {
  setLoggingEnabled(false);
  res.json({
    success: true,
    message: 'API logging disabled'
  });
});

app.get('/pharmacy/logs/stats', (req, res) => {
  res.json({
    success: true,
    data: getLogStats()
  });
});

app.delete('/pharmacy/logs/clear', (req, res) => {
  clearLogs();
  res.json({
    success: true,
    message: 'API logs cleared'
  });
});

app.get('/', async (req, res) => {
  return res.json({ 
    message: "Pharmacy server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    security: 'enabled',
    logging: getLogConfig().enabled ? 'enabled' : 'disabled'
  });
});

app.use("/pharmacy/auth", AuthRoutes);

app.use("/pharmacy/admin/master", verifyToken, authorizeRole('admin'), MasterRoutes);

app.use("/pharmacy/admin/master", verifyToken, authorizeRole('admin'), accountRoutes);

app.use("/pharmacy/api", verifyToken, groupRoutes);

app.use('/pharmacy/sales/bills/v1', verifyToken, salesBillRoutes);

app.use('/pharmacy/admin/master', verifyToken, authorizeRole('admin'), ledgerEntryRoutes);

app.use('/pharmacy/admin/master', verifyToken, authorizeRole('admin'), purchaseMasterRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl
  });
});

app.use(securityErrorHandler);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

module.exports = { app, sequelize }; 
