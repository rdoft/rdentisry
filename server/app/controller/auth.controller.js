const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;
const Token = db.token;
const Agreement = db.agreement;

const { sendResetMail, sendVerifyMail } = require("../utils/mail.util");
const dns = require("dns").promises;
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { HOSTNAME, HOST_SERVER, PORT } = process.env;
const HOST = HOSTNAME || HOST_SERVER || "localhost";
const PORT_CLIENT = PORT || 3000;

exports.login = async (req, res) => {
  res.status(200).send({
    agreement: req.user.Agreement,
    verified: req.user.Verified,
  });
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
  let domain;
  let addr;

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

    // Control if email dns is valid
    domain = email.split("@")[1];
    try {
      addr = await dns.resolve(domain);
      if (!addr.length) {
        return res
          .status(400)
          .send({ message: "Mail adresinizi kontrol edin" });
      }
    } catch (error) {
      return res.status(400).send({ message: "Mail adresinizi kontrol edin" });
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
    res.redirect(`https://${HOST}:${PORT_CLIENT}/`);
  } else {
    res.redirect(`https://${HOST}:${PORT_CLIENT}/login`);
  }
  res.status(200).send();
};

/**
 * Control the token for the given type
 * @param token
 * @query type
 */
exports.controlToken = async (req, res) => {
  const { token } = req.params;
  const { type = "reset" } = req.query; // reset or email
  let user;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          Type: type,
          where: {
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      return res.status(400).send({
        message: "Bağlantı linki geçersiz veya süresi dolmuştur",
      });
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      return res.status(400).send({
        message: "Bağlantı linki geçersiz veya süresi dolmuştur",
      });
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Forgot password
 * @body User email
 */
exports.forgot = async (req, res) => {
  const { email } = req.body;
  let token;
  let user;

  try {
    token = crypto.randomBytes(32).toString("hex");
    user = await User.findOne({
      where: {
        Email: email,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Geçersiz mail adresi" });
    }

    await Token.upsert(
      {
        UserId: user.UserId,
        Token: token,
        Expiration: Date.now() + 3600000, // 1 hour
        Type: "reset",
      },
      {
        where: {
          UserId: user.UserId,
          Type: "reset",
        },
      }
    );

    await sendResetMail(email, `https://${HOST}:${PORT_CLIENT}/reset/${token}`);

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Reset password
 * @body password
 */
exports.reset = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  let user;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          Type: "reset",
          where: {
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      return res.status(400).send({
        message: "Şifre sıfırlama linki geçersiz veya süresi dolmuştur",
      });
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      return res.status(400).send({
        message: "Şifre sıfırlama linki geçersiz veya süresi dolmuştur",
      });
    }

    // Delete reset token
    await Token.destroy({
      where: {
        UserId: user.UserId,
        Type: "reset",
      },
    });

    // Generate a salt and Hash the password with the salt
    // And update user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.update(
      {
        Password: hashedPassword,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Init verify for email
 */
exports.initVerify = async (req, res) => {
  const { UserId: userId } = req.user;
  let token;
  let user;

  try {
    token = crypto.randomBytes(32).toString("hex");
    user = await User.findOne({
      where: {
        UserId: userId,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Geçersiz kullanıcı" });
    }
    if (user.Verified) {
      return res.status(400).send({ message: "Mail adresi zaten doğrulanmış" });
    }

    await Token.upsert(
      {
        UserId: userId,
        Token: token,
        Expiration: Date.now() + 86400000, // 24 hours
        Type: "email",
      },
      {
        where: {
          UserId: userId,
          Type: "email",
        },
      }
    );

    await sendVerifyMail(
      user.Email,
      `https://${HOST}:${PORT_CLIENT}/verify/${token}`
    );
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Complete the email verification
 */
exports.completeVerify = async (req, res) => {
  const { token } = req.params;
  let user;

  try {
    user = await User.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          Type: "email",
          where: {
            Token: token,
            Expiration: {
              [Sequelize.Op.gt]: Date.now(),
            },
          },
          required: true,
        },
      ],
    });

    // If user or token not found, respond with an error
    if (!user) {
      return res.status(400).send({
        message: "Doğrulama linki geçersiz veya süresi dolmuştur",
      });
    }

    // Time safe comparison for more security
    if (
      !crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(user.tokens[0].Token)
      )
    ) {
      return res.status(400).send({
        message: "Doğrulama linki geçersiz veya süresi dolmuştur",
      });
    }

    // Delete email token
    await Token.destroy({
      where: {
        UserId: user.UserId,
        Type: "email",
      },
    });

    // Update user verified status
    User.update(
      {
        Verified: true,
      },
      {
        where: {
          UserId: user.UserId,
        },
      }
    );

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 * Permission check
 */
exports.permission = async (req, res) => {
  if (req.user) {
    res.status(200).send({ permission: true, agreement: req.user.Agreement });
  } else {
    res.status(401).send({ permission: false });
  }
};

/**
 * Agreement accept
 * @body aggreement
 */
exports.agree = async (req, res) => {
  const { UserId: userId } = req.user;
  const { ip, device, agent, isMobile } = req.body;

  try {
    await Agreement.findOrCreate({
      where: {
        UserId: userId,
      },
      defaults: {
        UserId: userId,
        IP: ip,
        Device: device,
        Agent: agent,
        IsMobile: isMobile,
      },
    });

    await User.update(
      {
        Agreement: true,
      },
      {
        where: {
          UserId: userId,
        },
      }
    );

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};
