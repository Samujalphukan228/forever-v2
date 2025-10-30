import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const currency = "inr";
const DeliveryCharge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

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

// ✨ Order OTP Email Template
const orderOTPTemplate = (otp, orderDetails) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Order</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">forEver</h1>
                <p style="margin: 10px 0 0 0; color: #cccccc; font-size: 14px; font-weight: 400;">E-COMMERCE</p>
              </td>
            </tr>
            
            <!-- Content -->
            <tr>
              <td style="padding: 50px 40px; text-align: center;">
                <div style="width: 64px; height: 64px; background-color: #000000; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #ffffff; font-size: 32px;">📦</span>
                </div>
                
                <h2 style="margin: 0 0 16px 0; color: #000000; font-size: 24px; font-weight: 600;">Confirm Your Order</h2>
                <p style="margin: 0 0 32px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                  Thank you for your order! Please use the verification code below to confirm your order.
                </p>
                
                <!-- OTP Box -->
                <div style="background-color: #000000; border-radius: 8px; padding: 30px; margin: 0 auto 32px; display: inline-block; min-width: 280px;">
                  <p style="margin: 0 0 12px 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">Order Verification Code</p>
                  <p style="margin: 0; color: #ffffff; font-size: 40px; font-weight: 700; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace;">${otp}</p>
                </div>
                
                <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px;">
                  This code will expire in <strong style="color: #000000;">10 minutes</strong>
                </p>
                
                <!-- Order Details -->
                <div style="margin-top: 40px; padding: 24px; background-color: #f5f5f5; border-radius: 8px; text-align: left;">
                  <h3 style="margin: 0 0 16px 0; color: #000000; font-size: 16px; font-weight: 600;">Order Details</h3>
                  <table width="100%" cellpadding="8" cellspacing="0">
                    <tr>
                      <td style="color: #666666; font-size: 14px;">Total Items:</td>
                      <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">${orderDetails.itemCount}</td>
                    </tr>
                    <tr>
                      <td style="color: #666666; font-size: 14px;">Total Amount:</td>
                      <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">₹${orderDetails.amount}</td>
                    </tr>
                    <tr>
                      <td style="color: #666666; font-size: 14px;">Payment Method:</td>
                      <td style="color: #000000; font-size: 14px; font-weight: 600; text-align: right;">${orderDetails.paymentMethod}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    If you didn't place this order, please contact our support immediately.
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #fafafa; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                <p style="margin: 0 0 4px 0; color: #000000; font-size: 14px; font-weight: 600;">
                  forEver
                </p>
                <p style="margin: 0; color: #999999; font-size: 12px;">
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
`;

// ✨ Send Order OTP Email
async function sendOrderOTP(email, otp, orderDetails) {
  const htmlContent = orderOTPTemplate(otp, orderDetails);

  await transporter.sendMail({
    from: `"forEver" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Order - forEver",
    html: htmlContent,
    text: `Your order verification code is ${otp}. It expires in 10 minutes.`,
  });
}

// Utility: validate required fields
const validateOrderFields = ({ userId, items, amount, address }) => {
  if (!userId) return "User ID is missing";
  if (!items || !Array.isArray(items) || items.length === 0) return "Items are missing or invalid";
  if (!amount || Number(amount) <= 0) return "Amount is missing or invalid";
  if (!address || typeof address !== "object" || Object.keys(address).length === 0)
    return "Address is missing or invalid";
  return null;
};

// Helper to obtain userId
const resolveUserId = (req) => req.user?.id || req.body?.userId || null;

// 🔹 Place COD Order (with OTP)
const placeOrder = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { items, amount, address } = req.body;

    const validationError = validateOrderFields({ userId, items, amount, address });
    if (validationError) return res.json({ success: false, message: validationError });

    // Get user email
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const otp = generateOTP();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      otp,
      otpExpires: otpExpiresAt,
      date: Date.now(),
      status: "Pending OTP Verification",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart after order
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} }).catch(() => {});
    }

    // Send OTP email
    try {
      await sendOrderOTP(user.email, otp, {
        itemCount: items.length,
        amount: amount,
        paymentMethod: "Cash on Delivery"
      });
      console.log(`✅ OTP email sent to ${user.email} for order ${newOrder._id}`);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: "Order placed successfully. Please check your email for OTP verification.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Verify OTP for COD Orders
const verifyOrderOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;
    
    if (!orderId || !otp) {
      return res.json({ success: false, message: "Order ID and OTP are required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Pending OTP Verification") {
      return res.json({ success: false, message: "Order already verified or processed" });
    }

    // Simple OTP comparison (like in userController)
    if (order.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (order.otpExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Update order status
    order.status = "Order Placed";
    order.otp = undefined;
    order.otpExpires = undefined;
    await order.save();

    res.json({ 
      success: true, 
      message: "OTP verified successfully. Order confirmed!" 
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Stripe Payment Order
const placeOrderStripe = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { items, amount, address } = req.body;
    const origin = req.headers.origin || req.headers.referer || req.body.origin || "";

    const validationError = validateOrderFields({ userId, items, amount, address });
    if (validationError) return res.json({ success: false, message: validationError });

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = (items || []).map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name || "Unnamed Item" },
        unit_amount: Math.round((Number(item.price) || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(DeliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Verify Stripe payment
const verifyStripe = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { orderId, success } = req.body;
    if (!orderId) return res.json({ success: false, message: "Order ID is required" });

    if (String(success) === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Placed" });
      if (userId) {
        await userModel.findByIdAndUpdate(userId, { cartData: {} }).catch(() => {});
      }
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Verify Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Razorpay placeholder
const placeOrderRazorpay = async (req, res) => {
  res.json({ success: false, message: "Razorpay not implemented yet" });
};

// 🔹 Get all orders (Admin)
const allOrders = async (_, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Get user orders
const userOrders = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.json({ success: false, message: "User ID is required" });
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.json({ success: false, message: "Order ID and status are required" });

    const validStatuses = ["Pending OTP Verification", "Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) return res.json({ success: false, message: "Invalid status" });

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Status updated successfully", order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Delete single order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.json({ success: false, message: "Order ID is required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted successfully", deletedOrderId: orderId });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Bulk delete orders
const bulkDeleteOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0)
      return res.json({ success: false, message: "Order IDs array is required" });

    const result = await orderModel.deleteMany({ _id: { $in: orderIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} orders deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Get order by ID (Admin)
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.json({ success: false, message: "Order ID is required" });

    const order = await orderModel.findById(orderId).populate("userId", "name email");
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 🔹 Cancel order (User)
const cancelOrder = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { orderId } = req.body;
    if (!orderId || !userId) return res.json({ success: false, message: "Order ID and User ID are required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (order.userId.toString() !== userId) return res.json({ success: false, message: "Unauthorized action" });

    const cancellableStatuses = ["Pending OTP Verification", "Order Placed", "Packing"];
    if (!cancellableStatuses.includes(order.status))
      return res.json({ success: false, message: "Cannot cancel order. Already shipped or delivered." });

    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Export all
export {
  placeOrder,
  verifyOrderOtp,
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
};