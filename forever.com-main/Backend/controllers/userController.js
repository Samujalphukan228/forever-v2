import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// -----------------------------
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
    rejectUnauthorized: false,
  },
});

// ------------------------------
// OTP helpers
// ------------------------------
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✨ Beautiful HTML Email Templates
const emailTemplates = {
  signup: (otp) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header with Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to forEver! 🎉</h1>
                  <p style="margin: 10px 0 0 0; color: #e8e8ff; font-size: 16px;">Let's verify your email address</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    Thank you for signing up! Please use the verification code below to complete your registration.
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 30px 0; display: inline-block;">
                    <p style="margin: 0 0 8px 0; color: #e8e8ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                    <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px;">
                    ⏱️ This code will expire in <strong>10 minutes</strong>
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 13px;">
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                    <strong>forEver E-Commerce</strong>
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    © 2024 forEver. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  login: (otp) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 Login Verification</h1>
                  <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">Secure your account access</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    A login attempt was made to your account. Please use the code below to continue.
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 12px; padding: 25px; margin: 30px 0; display: inline-block;">
                    <p style="margin: 0 0 8px 0; color: #dbeafe; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Login Code</p>
                    <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px;">
                    ⏱️ This code will expire in <strong>10 minutes</strong>
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; text-align: left;">
                      <p style="margin: 0; color: #92400e; font-size: 13px;">
                        ⚠️ <strong>Security Alert:</strong> If you didn't attempt to log in, please secure your account immediately.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                    <strong>forEver E-Commerce</strong>
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    © 2024 forEver. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,

  reset: (otp) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔑 Password Reset Request</h1>
                  <p style="margin: 10px 0 0 0; color: #fef3c7; font-size: 16px;">Reset your password securely</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px; text-align: center;">
                  <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                    We received a request to reset your password. Use the code below to create a new password.
                  </p>
                  
                  <!-- OTP Box -->
                  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 25px; margin: 30px 0; display: inline-block;">
                    <p style="margin: 0 0 8px 0; color: #fef3c7; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Password Reset Code</p>
                    <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px;">
                    ⏱️ This code will expire in <strong>10 minutes</strong>
                  </p>
                  
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                    <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; text-align: left;">
                      <p style="margin: 0; color: #991b1b; font-size: 13px;">
                        ⚠️ <strong>Important:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                    <strong>forEver E-Commerce</strong>
                  </p>
                  <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                    © 2024 forEver. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
};

// ✨ Improved sendOTP function with HTML emails
async function sendOTP(email, otp, purpose) {
  const subjects = {
    signup: "🎉 Verify Your Email - forEver",
    login: "🔐 Login Verification Code - forEver",
    reset: "🔑 Password Reset Code - forEver",
  };

  const htmlContent = emailTemplates[purpose](otp);

  await transporter.sendMail({
    from: `"forEver E-Commerce" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjects[purpose] || "Verification Code",
    html: htmlContent,
    // Fallback plain text
    text: `Your OTP for ${purpose} is ${otp}. It expires in 10 minutes.`,
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
      otpExpires: Date.now() + 10 * 60 * 1000,
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

    if (!useOTP) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.json({ success: false, message: "Invalid credentials" });

      const token = createToken(user._id);
      return res.json({ success: true, token });
    }

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
