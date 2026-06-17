const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Authorization header se token lena
    const authHeader = req.header("Authorization");

    // Token nahi mila
    if (!authHeader) {
      return res.status(401).json({
        message: "No token, access denied"
      });
    }

    // Bearer token me se actual token nikalna
    const token = authHeader.split(" ")[1];

    // Token verify karna
    const decoded = jwt.verify(token, "mySecretKey");

    // User ki information request me save karna
    req.user = decoded;

    // Next middleware ya route par jana
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = auth;