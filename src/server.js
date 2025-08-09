const { app, sequelize } = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate()
      .then(() => { 
        console.log("Database Connected Successfully");
      })
      .catch((err) => {
        console.log("Error connecting to the Database:", err);
      });
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Security: Enhanced security middleware active`);
      console.log(`📊 API Logging: Enabled`);
      console.log(`📊 Health Check: http://localhost:${PORT}/pharmacy/security/health`);
      console.log(`📊 Logs Config: http://localhost:${PORT}/pharmacy/logs/config`);
      console.log(`📊 Logs Stats: http://localhost:${PORT}/pharmacy/logs/stats`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  sequelize.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  sequelize.close();
  process.exit(0);
});

startServer(); 