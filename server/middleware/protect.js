import jwt from "jsonwebtoken";

// COMMENT: This middleware function protects routes to ensure that only authenticated users can access them.
export const protect = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (like userId) to the request object
    next(); // Token is valid, allow the request to continue
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
