// Restrictng routes a user is not allowed to visit if not logged in
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).send();
};

// Restrict routes for inactive users
const isActive = (req, res, next) => {
  const now = new Date();

  if (
    req.user &&
    req.user.AccountExpiration &&
    req.user.AccountExpiration > now
  ) {
    return next();
  }
  return res.status(403).send({
    message:
      "Aktif aboneliğiniz bulunmamaktadır. Lütfen aboneliğinizi yenileyiniz.",
  });
};

module.exports = {
  isAuthenticated,
  isActive,
};
