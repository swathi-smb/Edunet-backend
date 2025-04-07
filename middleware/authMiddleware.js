import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in environment variables');
} else {
  console.log('✅ JWT_SECRET in middleware:', JWT_SECRET);
}
const authMiddleware = (req, res, next) => {
  console.log("Authorization Header:", req.header("Authorization")); // Log the header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1]; // Ensure Bearer token format
  console.log("Extracted Token:", token);
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Middleware decoded:", decoded); // Log the decoded token
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error.message);
    console.error("Token being verified:", token);
    console.error("Current JWT_SECRET:", JWT_SECRET);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
  
};

export default authMiddleware;
