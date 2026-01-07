export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

//temporary
// export const requireRole = (role) => {
//   return (req, res, next) => {
//     console.log("ROLE CHECK:", req.user.role, "EXPECTED:", role);
//     next();
//   };
// };

