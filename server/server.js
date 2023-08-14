const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const HOST = process.env.HOST_SERVER || "localhost";
const PORT = process.env.PORT_SERVER || 8080;
const PORT_CLIENT = process.env.PORT || 3000;
const corsOptions = {
  origin: [
    `http://${HOST}:${PORT}`,
    `http://${HOST}:${PORT_CLIENT}`,
    `http://${HOST}`,
    `http://srv.rdoft.com`,
  ],
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// db models
const db = require("./app/models/index");
db.sequelize.sync({ alter: true });

// routes
require("./app/routes/index")(app);

// Schedule the reminder to run every day at a specific time
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
const reminder = require("./app/services/reminder.service");
cron.schedule("19 14 * * *", () => {
  reminder.run();
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}.`);
});
