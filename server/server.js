const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

const HOST = process.env.HOST_SERVER || "localhost";
const PORT = process.env.PORT_SERVER || 8080;
const PORT_CLIENT = process.env.PORT || 3000;
const corsOptions = {
  origin: [`http://${HOST}:${PORT}`, `http://${HOST}:${PORT_CLIENT}`, `http://${HOST}`, `http://srv.rdoft.com`]
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// db models
const db = require("./app/models/index");
db.sequelize.sync({ alter: true })

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to rdentistry" });
});

// routes
require("./app/routes/index")(app);

// cron jobs
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

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}.`);
});