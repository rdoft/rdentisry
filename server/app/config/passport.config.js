const { Sequelize } = require("../models");
const db = require("../models");
const User = db.user;

const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Get env variables
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST_SERVER, PORT_SERVER } =
  process.env;

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
        if (!user.Password) {
          return cb(null, false, {
            message: "Kullanıcı adı veya şifre yanlış",
          });
        }
        
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

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `https://${HOST_SERVER}:${PORT_SERVER}/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const [user, created] = await User.findOrCreate({
          where: {
            Email: profile.emails[0].value,
          },
        });
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
