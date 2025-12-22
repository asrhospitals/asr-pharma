const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log(
    "⚠️  .env file not found or error loading:",
    result.error.message
  );
  console.log("🔍 Looking for .env file at:", envPath);
} else {
  console.log("✅ .env file loaded successfully from:", envPath);
}

console.log("🌍 Current NODE_ENV:", process.env.NODE_ENV || "development");

const express = require("express");
const db = require("./database/index");
const sequelize = db.sequelize;
const setupSwagger = require("../swagger-setup");

const {
  applySecurityMiddleware,
  applyRouteSpecificRateLimiting,
  securityErrorHandler,
  securityHealthCheck,
  verifyToken,
  authorizeRole,
  validateUserLogin,
  validateUserRegistration,
} = require("./middleware/security");

const {
  apiLogger,
  setLoggingEnabled,
  getLogConfig,
  getLogStats,
  clearLogs,
} = require("./middleware/logging/apiLogger");

const MasterRoutes = require("./routes/master/masterroutes");
const AuthRoutes = require("./routes/auth/auth");
const salesBillRoutes = require("./routes/sales/billRoutes");
const purchaseBillRoutes = require("./routes/purchase/purchaseBill");
const accountRoutes = require("./routes/master/accountRoutes");
const groupRoutes = require("./routes/master/groupRoutes");
const ledgerEntryRoutes = require("./routes/master/ledgerEntryRoutes");
const purchaseMasterRoutes = require("./routes/master/purchaseMasterRoutes");
const companyContext = require("./middleware/default/companyId");

const app = express();

applySecurityMiddleware(app, process.env.NODE_ENV || "development");

// Setup Swagger UI with authentication
setupSwagger(app);

// app.use(apiLogger);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

applyRouteSpecificRateLimiting(app);

app.get("/pharmacy/security/health", securityHealthCheck);

app.get("/pharmacy/logs/config", (req, res) => {
  res.json({
    success: true,
    data: getLogConfig(),
  });
});

app.post("/pharmacy/logs/enable", (req, res) => {
  setLoggingEnabled(true);
  res.json({
    success: true,
    message: "API logging enabled",
  });
});

app.post("/pharmacy/logs/disable", (req, res) => {
  setLoggingEnabled(false);
  res.json({
    success: true,
    message: "API logging disabled",
  });
});

app.get("/pharmacy/logs/stats", (req, res) => {
  res.json({
    success: true,
    data: getLogStats(),
  });
});

app.delete("/pharmacy/logs/clear", (req, res) => {
  clearLogs();
  res.json({
    success: true,
    message: "API logs cleared",
  });
});

app.get("/", async (req, res) => {
  return res.json({
    message: "Pharmacy server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    security: "enabled",
    logging: getLogConfig().enabled ? "enabled" : "disabled",
  });
});

app.get("/debug/env", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const envPath = path.join(process.cwd(), ".env");
  const envExists = fs.existsSync(envPath);

  let envContent = null;
  if (envExists) {
    try {
      envContent = fs.readFileSync(envPath, "utf8");
    } catch (error) {
      envContent = `Error reading .env file: ${error.message}`;
    }
  }

  res.json({
    success: true,
    data: {
      currentWorkingDirectory: process.cwd(),
      envFileExists: envExists,
      envFilePath: envPath,
      envFileContent: envContent,
      environmentVariables: {
        NODE_ENV: process.env.NODE_ENV,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD ? "[HIDDEN]" : "NOT SET",
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        JWT_SECRET: process.env.JWT_SECRET ? "[HIDDEN]" : "NOT SET",
      },
      processEnv: {
        NODE_ENV: process.env.NODE_ENV || "development",
      },
    },
  });
});

app.use("/pharmacy/auth", AuthRoutes);

app.use(
  "/pharmacy/admin/master",
  verifyToken,
  companyContext,
  authorizeRole("user","admin"),
  MasterRoutes
);

app.use(
  "/pharmacy/admin/master",
  verifyToken,
  companyContext,
  authorizeRole("user","admin"),
  accountRoutes
);

app.use("/pharmacy/api", verifyToken, companyContext, groupRoutes);

app.use(
  "/pharmacy/sales/bills/v1",
  verifyToken,
  companyContext,
  salesBillRoutes
);

app.use(
  "/pharmacy/admin/purchase/bill",
  verifyToken,
  companyContext,
  purchaseBillRoutes
);

app.use(
  "/pharmacy/admin/master",
  verifyToken,
  companyContext,
  authorizeRole("user","admin"),
  ledgerEntryRoutes
);

app.use(
  "/pharmacy/admin/master",
  verifyToken,
  companyContext,
  authorizeRole("user","admin"),
  purchaseMasterRoutes
);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "ROUTE_NOT_FOUND",
    path: req.originalUrl,
  });
});

app.use(securityErrorHandler);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    code: "INTERNAL_SERVER_ERROR",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = { app, sequelize };
