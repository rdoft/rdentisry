const log = require("../config/log.config");
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
      log.audit.info(`Get user completed`, {
        userId,
        action: "GET",
        success: true,
        resource: {
          type: "user",
          id: userId,
        },
      });
    } else {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
      log.audit.warn("Get user failed: User doesn't exist", {
        userId,
        action: "GET",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
    }
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};

/**
 * Update the user
 * @param userId id of the user
 * @body name and password
 */
exports.updateUser = async (req, res) => {
  const { UserId: userId } = req.user;
  const { name, oldPassword, password } = req.body;
  let user;

  try {
    user = await User.findOne({
      where: {
        UserId: userId,
      },
    });

    if (!user) {
      res.status(404).send({ message: "Kullanıcı mevcut değil" });
      log.audit.warn(`Update user failed: User doesn't exist`, {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    if (!password) {
      await user.update({
        Name: name,
      });

      res.status(200).send();
      log.audit.info(`Update user completed`, {
        userId,
        action: "PUT",
        success: true,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    // Check if the old password is matched with the user's password
    // It can be null on the db if the user signed up with a social media account
    if ((!user.Password && oldPassword) || (user.Password && !oldPassword)) {
      res.status(400).send({ message: "Eski şifre yanlış" });
      log.access.warn(`Update user failed: Wrong password`, {
        userId,
        action: "PUT",
        success: false,
        resource: {
          type: "user",
          id: userId,
        },
      });
      return;
    }

    if (user.Password && oldPassword) {
      const isValid = await bcrypt.compare(oldPassword, user.Password);
      if (!isValid) {
        res.status(400).send({ message: "Eski şifre yanlış" });
        log.access.warn(`Update user failed: Wrong password`, {
          userId,
          action: "PUT",
          success: false,
          resource: {
            type: "user",
            id: userId,
          },
        });
        return;
      }
    }

    // Hash the password with the salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.update({
      Password: hashedPassword,
    });

    res.status(200).send();
    log.access.info(`Update user password completed`, {
      userId,
      action: "RESET",
      success: true,
      request: {
        ip: req.ip,
        agent: req.headers["user-agent"],
      },
    });
  } catch (error) {
    res.status(500).send(error);
    log.error.error(error);
  }
};
