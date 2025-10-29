import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ this must exist
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default authUser;
