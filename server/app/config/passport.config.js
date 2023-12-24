const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

// Local strategy for username password login
passport.use(
  new LocalStrategy(
    {
      // Our user will sign in using an email, rather than a "username"
      usernameField: "email",
    },
    async function (email, password, cb) {
      try {
        const user = await User.findOne({
          where: {
            Email: email,
          },
        });

        // Check user exists
        if (!user) {
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }

        // Check password is valid
        const isValid = await bcrypt.compare(password, user.Password);
        if (!isValid) {
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
passport.serializeUser(function (user, cb) {
  cb(null, user.UserId);
});

passport.deserializeUser(function (id, cb) {
  User.findByPk(id).then(function (user) {
    cb(null, user);
  });
});

module.exports = passport;
