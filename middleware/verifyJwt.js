const jwt = require("jsonwebtoken");

/**
 * @DESC Verify JWT from authorization header Middleware
 */
const verifyJwt = (req, res, next) => {
  try {
    console.log(req);
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"] || "";
    const jwtToken = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!jwtToken) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Verify the JWT token
    jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token." });
      }
      req.user = decoded.UserInfo;

      next();
    });
  } catch (error) {
    console.error("Error in verifyJwt middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = verifyJwt;
