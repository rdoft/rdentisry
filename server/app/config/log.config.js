const path = require("path");
const winston = require("winston");
const { combine, timestamp, json, errors } = winston.format;

// Define the log files path
const LOG_DIR = path.resolve(__dirname, `../logs`);
const FILE_ERROR = `${LOG_DIR}/error.log`;
const FILE_ACCESS = `${LOG_DIR}/access.log`;
const FILE_AUDIT = `${LOG_DIR}/audit.log`;
const FILE_API = `${LOG_DIR}/api.log`;
const FILE_APP = `${LOG_DIR}/app.log`;

// Logger for the application info
winston.loggers.add("app", {
  level: "verbose",
  maxsize: 5242880, // 5MB
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: FILE_APP })],
});

// Logger for error.log
winston.loggers.add("error", {
  level: "error",
  maxsize: 5242880, // 5MB
  defaultMeta: {
    userId: null,
    stack: null,
  },
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: FILE_ERROR }),
    new winston.transports.File({ filename: FILE_APP }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: FILE_ERROR })],
  rejectionHandlers: [new winston.transports.File({ filename: FILE_ERROR })],
});

// Logger for access.log
winston.loggers.add("access", {
  level: "info",
  maxsize: 5242880, // 5MB
  defaultMeta: {
    userId: null,
    mail: null,
    action: null,
    success: null,
  },
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: FILE_ACCESS }),
    new winston.transports.File({ filename: FILE_APP }),
  ],
});

// Logger for audit.log
winston.loggers.add("audit", {
  level: "info",
  maxsize: 5242880, // 5MB
  defaultMeta: {
    userId: null,
    action: null,
    resource: {
      type: null,
      ids: [],
    },
  },
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: FILE_AUDIT }),
    new winston.transports.File({ filename: FILE_APP }),
  ],
});

// Logger for api.log
winston.loggers.add("api", {
  level: "http",
  maxsize: 5242880, // 5MB
  defaultMeta: {
    userId: null,
    ip: null,
    method: null,
    url: null,
    status: null,
    agent: null,
  },
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: FILE_API }),
    new winston.transports.File({ filename: FILE_APP }),
  ],
});

// Create loggers for the application
const app = winston.loggers.get("app");
const error = winston.loggers.get("error");
const access = winston.loggers.get("access");
const audit = winston.loggers.get("audit");
const api = winston.loggers.get("api");

// Create a stream object that will be used by `morgan`
api.stream = (req, res) => {
  api.http(`API request ${req.method} ${req.originalUrl}`, {
    userId: req.user?.UserId || null,
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    agent: req.headers["user-agent"],
  });
};

module.exports = {
  app,
  error,
  access,
  audit,
  api,
};
