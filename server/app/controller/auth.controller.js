const e = require("express");
const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");

const HOST = process.env.HOST_SERVER || "localhost";
const PORT_CLIENT = process.env.PORT || 3000;

exports.login = async (req, res) => {
  res.status(200).send();
};

exports.logout = async (req, res, next) => {
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

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Control if user exists
    user = await User.findOne({
      where: {
        Email: email,
      },
    });
    if (user && user.Password) {
      return res.status(400).send({ message: "Mail adresi zaten kayıtlıdır" });
    }

    // Create user record
    if (!user) {
      user = await User.create({
        Name: name,
        Email: email,
        Password: hashedPassword,
      });
    } else {
      await User.update(
        {
          Name: name,
          Password: hashedPassword,
        },
        {
          where: {
            Email: email,
          },
        }
      );
    }

    // Login user
    req.login(user, function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send();
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.google = async (req, res) => {
  if (req.user) {
    res.redirect(`http://${HOST}:${PORT_CLIENT}/`);
  } else {
    res.redirect(`http://${HOST}:${PORT_CLIENT}/login`);
  }
  res.status(200).send();
};
