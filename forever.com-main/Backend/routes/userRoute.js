import express from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
  verifyLoginOTP,
  forgotPassword,
  resetPassword,
  adminLogin,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Auth routes
userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/login", loginUser);
userRouter.post("/verify-login-otp", verifyLoginOTP);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// Admin route
userRouter.post("/admin", adminLogin);

export default userRouter;
