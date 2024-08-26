const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");

/**
 * Get the user
 * @param userId id of the user
 */
exports.getUser = async (req, res) => {
  const { UserId: userId } = req.user;
  let user;

  try {
    user = await User.findOne({
      attributes: [
        ["Name", "name"],
        ["Email", "email"],
        ["Agreement", "agreement"],
        ["Verified", "verified"],
      ],
      where: {
        UserId: userId,
      },
    });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Update the user
 * @param userId id of the user
 * @body name and password
 */
exports.updateUser = async (req, res) => {
  const { UserId: userId } = req.user;
  const { name, password } = req.body;
  let user;

  try {
    user = await User.findOne({
      where: {
        UserId: userId,
      },
    });

    if (user) {
      if (password) {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.update({
          Password: hashedPassword,
        });
      } else {
        await user.update({
          Name: name,
        });
      }

      res.status(200).send();
    } else {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
