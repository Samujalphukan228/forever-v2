import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ------------------------------
// JWT token generator
// ------------------------------
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ------------------------------
// Email transporter (Nodemailer)
// ------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ✅ Fixes the self-signed cert error
  },
});


// ------------------------------
// OTP helpers
// ------------------------------
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(email, otp, purpose) {
  const subjects = {
    signup: "Verify your account",
    login: "Login verification code",
    reset: "Password reset code",
  };

  const text = `Your OTP for ${purpose} is ${otp}. It expires in 10 minutes.`;

  await transporter.sendMail({
    from: `"E-Commerce App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose] || "Verification Code",
    text,
  });
}

// ------------------------------
// 1️⃣ Register user + send OTP
// ------------------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });
    if (password.length < 6)
      return res.json({ success: false, message: "Weak password" });

    const exists = await userModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();

    await userModel.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpPurpose: "signup",
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await sendOTP(email, otp, "signup");

    res.json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 2️⃣ Verify signup OTP
// ------------------------------
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.json({ success: false, message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 3️⃣ Login (password or OTP-based)
// ------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password, useOTP } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    if (!user.isVerified)
      return res.json({ success: false, message: "Please verify your email first" });

    // 🔹 Option 1: Password login
    if (!useOTP) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({ success: false, message: "Invalid credentials" });

      const token = createToken(user._id);
      return res.json({ success: true, token });
    }

    // 🔹 Option 2: OTP login
    const otp = generateOTP();
    user.otp = otp;
    user.otpPurpose = "login";
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp, "login");
    res.json({ success: true, message: "OTP sent for login" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 4️⃣ Verify Login OTP
// ------------------------------
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.json({ success: false, message: "Invalid or expired OTP" });

    user.otp = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 5️⃣ Forgot password (send OTP)
// ------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "No user found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpPurpose = "reset";
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp, "reset");

    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 6️⃣ Reset password using OTP
// ------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.json({ success: false, message: "Invalid or expired OTP" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ------------------------------
// 7️⃣ Admin login
// ------------------------------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👇 Add these two lines here
    console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
