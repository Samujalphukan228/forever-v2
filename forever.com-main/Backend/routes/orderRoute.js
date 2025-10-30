import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  deleteOrder,
  bulkDeleteOrders,
  getOrderById,
  cancelOrder,
  verifyOrderOtp // ✅ added
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// ========== ADMIN FEATURES ==========

// Get all orders
orderRouter.post("/list", adminAuth, allOrders);

// Update order status
orderRouter.post("/status", adminAuth, updateStatus);

// Delete single order
orderRouter.post("/delete", adminAuth, deleteOrder);

// Bulk delete orders
orderRouter.post("/bulk-delete", adminAuth, bulkDeleteOrders);

// Get order details by ID
orderRouter.post("/details", adminAuth, getOrderById);

// ========== PAYMENT ROUTES ==========

// Place order with Cash on Delivery (OTP-based)
orderRouter.post("/place", authUser, placeOrder);

// ✅ Verify OTP for COD orders
orderRouter.post("/verify-otp", authUser, verifyOrderOtp);

// Place order with Stripe
orderRouter.post("/stripe", authUser, placeOrderStripe);

// Verify Stripe payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);

// Place order with Razorpay (future)
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// ========== USER FEATURES ==========

// Get user's orders
orderRouter.post("/userorders", authUser, userOrders);

// Cancel order (user can cancel their own order)
orderRouter.post("/cancel", authUser, cancelOrder);

export default orderRouter;
