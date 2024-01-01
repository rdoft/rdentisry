const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  res.status(200).send();
};

exports.logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  let user;

  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  // Add user record
  user = await User.findOne({
    where: {
      Email: email,
    },
  });

  if (user) {
    return res.status(400).send({ message: "Mail adresi zaten kayıtlı" });
  }

  user = await User.create({
    Name: name,
    Email: email,
    Password: hashedPassword,
  });

  // Login user
  req.login(user, function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
};
