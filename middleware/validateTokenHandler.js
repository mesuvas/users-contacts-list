const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Token verification failed, return unauthorized error
        return res.status(401).json({ message: "User is not authorized" });
      }
      // Token is valid, attach decoded data to request object
      req.user = decoded.user;
      console.log(decoded);
      next(); // Move to the next middleware or route handler

    });
  } else {
    // No authorization header or invalid format, return unauthorized error
    return res.status(401).json({ message: "User is not authorized" });
  }

  if (!token) {
    res.status(401);
    throw new Error("User is not authorized or token missing");
  }
});



module.exports = validateToken;


