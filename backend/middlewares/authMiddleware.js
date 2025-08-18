const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied. No token provided." });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const verified = jwt.verify(token, JWT_SECRET);

    // assign _id properly so controllers can use req.user._id
    req.user = { _id: verified.userId };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
