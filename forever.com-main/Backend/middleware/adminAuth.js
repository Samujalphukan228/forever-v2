import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    let token = req.headers["token"] || req.headers["authorization"];

    if (!token)
      return res.status(401).json({ success: false, message: "Not Authorized" });

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin
    if (decoded?.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    console.log("Admin Auth Error:", err.message);
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};

export default adminAuth;
