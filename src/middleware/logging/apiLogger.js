const fs = require('fs');
const path = require('path');

const LOG_CONFIG = {
  enabled: process.env.API_LOGGING_ENABLED === 'true' || true,
  logToFile: process.env.API_LOG_TO_FILE === 'true' || false,
  logToConsole: process.env.API_LOG_TO_CONSOLE !== 'false',
  logLevel: process.env.API_LOG_LEVEL || 'info',
  logDirectory: process.env.API_LOG_DIR || './logs',
  logFile: process.env.API_LOG_FILE || 'api.log',
  maxFileSize: process.env.API_MAX_FILE_SIZE || 10 * 1024 * 1024,
  maxFiles: process.env.API_MAX_FILES || 5,
  includeHeaders: process.env.API_LOG_HEADERS === 'true' || false,
  includeBody: process.env.API_LOG_BODY === 'true' || false,
  includeQuery: process.env.API_LOG_QUERY === 'true' || false,
  includeParams: process.env.API_LOG_PARAMS === 'true' || false,
  sensitiveFields: ['password', 'token', 'secret', 'key', 'authorization'].map(field => field.toLowerCase()),
  excludedPaths: ['/health', '/metrics', '/favicon.ico'],
  excludedMethods: ['OPTIONS']
};

if (LOG_CONFIG.logToFile && !fs.existsSync(LOG_CONFIG.logDirectory)) {
  try {
    fs.mkdirSync(LOG_CONFIG.logDirectory, { recursive: true });
  } catch (error) {
    console.error('Failed to create log directory:', error);
  }
}

const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = { ...data };
  const sensitiveFields = LOG_CONFIG.sensitiveFields;
  
  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeData(sanitized[key]);
    }
  });
  
  return sanitized;
};

const formatLogEntry = (req, res, duration, error = null) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const statusCode = res.statusCode;
  const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  const userAgent = req.headers['user-agent'];
  const requestId = req.headers['x-request-id'] || 'no-id';
  
  const logEntry = {
    timestamp,
    requestId,
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    ip,
    userAgent: userAgent ? userAgent.substring(0, 100) : 'unknown'
  };

  if (LOG_CONFIG.includeHeaders) {
    logEntry.headers = sanitizeData(req.headers);
  }

  if (LOG_CONFIG.includeQuery && Object.keys(req.query).length > 0) {
    logEntry.query = sanitizeData(req.query);
  }

  if (LOG_CONFIG.includeParams && req.params && Object.keys(req.params).length > 0) {
    logEntry.params = sanitizeData(req.params);
  }

  if (LOG_CONFIG.includeBody && ['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
    logEntry.body = sanitizeData(req.body);
  }

  if (error) {
    logEntry.error = {
      message: error.message,
      stack: error.stack,
      code: error.code
    };
  }

  return logEntry;
};

const writeLogToFile = (logEntry) => {
  if (!LOG_CONFIG.logToFile) return;

  try {
    const logFilePath = path.join(LOG_CONFIG.logDirectory, LOG_CONFIG.logFile);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFilePath, logLine);
    
    const stats = fs.statSync(logFilePath);
    if (stats.size > LOG_CONFIG.maxFileSize) {
      rotateLogFile(logFilePath);
    }
  } catch (error) {
    console.error('Failed to write log to file:', error);
  }
};

const rotateLogFile = (logFilePath) => {
  try {
    for (let i = LOG_CONFIG.maxFiles - 1; i > 0; i--) {
      const oldFile = `${logFilePath}.${i}`;
      const newFile = `${logFilePath}.${i + 1}`;
      
      if (fs.existsSync(oldFile)) {
        if (i === LOG_CONFIG.maxFiles - 1) {
          fs.unlinkSync(oldFile);
        } else {
          fs.renameSync(oldFile, newFile);
        }
      }
    }
    
    fs.renameSync(logFilePath, `${logFilePath}.1`);
  } catch (error) {
    console.error('Failed to rotate log file:', error);
  }
};

const shouldLog = (statusCode, duration) => {
  switch (LOG_CONFIG.logLevel) {
    case 'error':
      return statusCode >= 400;
    case 'warn':
      return statusCode >= 400 || duration > 5000;
    case 'debug':
      return true;
    case 'info':
    default:
      return true;
  }
};

const apiLogger = (req, res, next) => {
  if (!LOG_CONFIG.enabled) {
    return next();
  }

  if (LOG_CONFIG.excludedPaths.some(path => req.url.includes(path)) ||
      LOG_CONFIG.excludedMethods.includes(req.method)) {
    return next();
  }

  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const logEntry = formatLogEntry(req, res, duration);
    
    if (shouldLog(res.statusCode, duration)) {
      if (LOG_CONFIG.logToConsole) {
        const logMessage = `[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} ${logEntry.statusCode} ${logEntry.duration} - ${logEntry.ip}`;
        
        if (res.statusCode >= 400) {
          console.error(logMessage);
        } else if (duration > 5000) {
          console.warn(logMessage);
        } else {
          console.log(logMessage);
        }
      }
      
      writeLogToFile(logEntry);
    }
    
    return originalSend.call(this, data);
  };

  res.on('error', (error) => {
    const duration = Date.now() - startTime;
    const logEntry = formatLogEntry(req, res, duration, error);
    
    if (LOG_CONFIG.logToConsole) {
      console.error(`[${logEntry.timestamp}] ERROR: ${logEntry.method} ${logEntry.url} - ${error.message}`);
    }
    
    writeLogToFile(logEntry);
  });

  next();
};

const setLoggingEnabled = (enabled) => {
  LOG_CONFIG.enabled = enabled;
  console.log(`API logging ${enabled ? 'enabled' : 'disabled'}`);
};

const updateLogConfig = (newConfig) => {
  Object.assign(LOG_CONFIG, newConfig);
  console.log('API logging configuration updated:', LOG_CONFIG);
};

const getLogConfig = () => {
  return { ...LOG_CONFIG };
};

const clearLogs = () => {
  if (LOG_CONFIG.logToFile) {
    try {
      const logFilePath = path.join(LOG_CONFIG.logDirectory, LOG_CONFIG.logFile);
      if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath);
        console.log('API logs cleared');
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
};


const getLogStats = () => {
  if (!LOG_CONFIG.logToFile) {
    return { error: 'File logging not enabled' };
  }

  try {
    const logFilePath = path.join(LOG_CONFIG.logDirectory, LOG_CONFIG.logFile);
    if (!fs.existsSync(logFilePath)) {
      return { error: 'Log file not found' };
    }

    const stats = fs.statSync(logFilePath);
    return {
      fileSize: stats.size,
      lastModified: stats.mtime,
      logDirectory: LOG_CONFIG.logDirectory,
      logFile: LOG_CONFIG.logFile
    };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  apiLogger,
  setLoggingEnabled,
  updateLogConfig,
  getLogConfig,
  clearLogs,
  getLogStats,
  LOG_CONFIG
}; 