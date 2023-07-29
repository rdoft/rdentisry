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

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}.`);
});