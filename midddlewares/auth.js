const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config"); // Assuming you have the secret key stored in a separate config file

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
//   console.log(token.split(" ")[1])
  console.log("token->", token);
  jwt.verify(token.split(" ")[1], secretKey, { expiresIn: '1h' },(err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // Add decoded user information to the request object
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
