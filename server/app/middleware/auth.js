// Restrictng routes a user is not allowed to visit if not logged in
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send();
};

module.exports = {
  isAuthenticated,
};
