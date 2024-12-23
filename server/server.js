const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// Requiring passport and session
const session = require("express-session");
const passport = require("./app/config/passport.config");
// Requiring loggers
const morgan = require("morgan");
const log = require("./app/config/log.config");

const ENV = process.env.ENV;
const SECRET_KEY = process.env.SECRET_KEY;
const HOSTNAME = process.env.HOSTNAME;
const HOST = process.env.HOST_SERVER;
const PORT = process.env.PORT_SERVER;
const PORT_SSL = process.env.PORT_SSL;
const PORT_CLIENT = process.env.PORT_CLIENT;
const corsOptions =
  ENV === "production"
    ? {
        origin: [`https://${HOST}`, `https://${HOSTNAME}`],
        credentials: true,
      }
    : ENV === "development"
    ? {
        origin: [
          `https://${HOST}:${PORT_SSL}`,
          `https://${HOSTNAME}:${PORT_SSL}`,
        ],
        credentials: true,
      }
    : {
        origin: [
          `https://${HOST}:${PORT_CLIENT}`,
          `https://${HOSTNAME}:${PORT_CLIENT} `,
        ],
        credentials: true,
      };

// db models
const db = require("./app/models");
db.sequelize.sync({ alter: true });

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// logging
app.use(
  morgan((tokens, req, res) => {
    log.api.stream(req, res);
    return null; // Prevents Morgan from logging to console
  })
);

// routes
require("./app/routes/index")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to dishekime" });
});

// CRON JOBS
// For example, '0 9 * * *' means every day at 9:00 AM.
// * * * * * *
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )
const cron = require("node-cron");

// Schedule the statusUpdater to run every day at a specific time
const statusUpdater = require("./app/services/statusUpdater.service");
cron.schedule("00 22 * * *", () => {
  statusUpdater.run();
});

// Schedule the notifications updater to run every day at a specific time
const notification = require("./app/services/notification.service");
cron.schedule("00 22 * * *", () => {
  notification.run();
});

// Schedule the reminder to run every day at a specific time
const reminder = require("./app/services/reminder.service");
cron.schedule("00 15 * * *", () => {
  reminder.run();
});

// Schedule the check SMS status to run every 15 minutes
const sms = require("./app/services/sms.service");
cron.schedule("*/15 * * * *", () => {
  sms.run();
});

// SERVER HTTPS
// options for https server
const options =
  ENV === "production" || ENV === "development"
    ? {
        key: fs.readFileSync("/etc/ssl/certs/server.key"),
        cert: fs.readFileSync("/etc/ssl/certs/server.crt"),
      }
    : {
        key: fs.readFileSync("./certs/server.key"),
        cert: fs.readFileSync("./certs/server.crt"),
      };

// create https server
const httpsServer = https.createServer(options, app);

// set port, listen for requests
httpsServer.listen(PORT, () => {
  log.app.info(`Server is running on ${HOST}:${PORT}.`);
});
