const fs = require("fs");
const http = require("http");
const https = require("https");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const morgan = require("morgan");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./app/config/passport.config");

const HOSTNAME = process.env.HOSTNAME || "disheki.me";
const HOST = process.env.HOST_SERVER || "localhost";
const PORT = process.env.PORT_SERVER || 8080;
const PORT_CLIENT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const corsOptions = {
  origin: [
    `https://${HOST}:${PORT}`,
    `https://${HOST}:${PORT_CLIENT}`,
    `https://${HOST}`,
    `https://${HOSTNAME}`,
    `https://${HOSTNAME}:${PORT_CLIENT}`,
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

// development logging
app.use(morgan("dev"));
app.use(
  session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
require("./app/routes/index")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to rdentistry" });
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

// SERVER HTTPS
app.use((req, res, next) => {
  if (req.protocol === "http") {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

// options for https server
const options = {
  key: fs.readFileSync("./app/certs/server.key"),
  cert: fs.readFileSync("./app/certs/certificate.crt"),
  ca: fs.readFileSync("./app/certs/intermediate.crt"),
  ca: [
    fs.readFileSync("gd1.crt"),
    fs.readFileSync("gd2.crt"),
    fs.readFileSync("gd3.crt"),
  ],
};

// create https server
http.createServer(app).listen(PORT);
const httpsServer = https.createServer(options, app);

// set port, listen for requests
httpsServer.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}.`);
});
