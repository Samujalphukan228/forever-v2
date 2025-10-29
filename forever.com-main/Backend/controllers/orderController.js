// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const currency = "inr";
const DeliveryCharge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Utility to validate required fields
const validateOrderFields = ({ userId, items, amount, address }) => {
  if (!userId) return "User ID is missing";
  if (!items || !Array.isArray(items) || items.length === 0) return "Items are missing or invalid";
  if (!amount || Number(amount) <= 0) return "Amount is missing or invalid";
  if (!address || typeof address !== "object" || Object.keys(address).length === 0)
    return "Address is missing or invalid";
  return null;
};

// Helper to obtain userId from auth or body
const resolveUserId = (req) => {
  // prefer auth middleware value, fall back to body (for tests or non-auth calls)
  return req.user?.id || req.body?.userId || null;
};

// COD Order
const placeOrder = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { items, amount, address } = req.body;

    const validationError = validateOrderFields({ userId, items, amount, address });
    if (validationError) return res.json({ success: false, message: validationError });

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      status: "Order Placed",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // clear user's cart in DB if possible (safe guard)
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} }).catch((e) => {
        console.warn("Failed to clear cartData after placing order:", e.message);
      });
    }

    res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Place order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Stripe Payment Order
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

    // add delivery charge
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

// Verify Stripe payment (called after redirect or webhook as you implement)
const verifyStripe = async (req, res) => {
  try {
    // If auth middleware is used, prefer req.user
    const userId = resolveUserId(req);
    const { orderId, success } = req.body;

    if (!orderId) return res.json({ success: false, message: "Order ID is required" });
    if (typeof success === "undefined") return res.json({ success: false, message: "Success flag is required" });

    if (String(success) === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Placed" });
      if (userId) {
        await userModel.findByIdAndUpdate(userId, { cartData: {} }).catch((e) => {
          console.warn("Failed to clear cartData after stripe verify:", e.message);
        });
      }
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Verify Stripe error:", error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  res.json({ success: false, message: "Razorpay payment not implemented yet" });
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = resolveUserId(req) || req.body.userId;
    if (!userId) return res.json({ success: false, message: "User ID is required" });

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) return res.json({ success: false, message: "Order ID and status are required" });

    const validStatuses = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) return res.json({ success: false, message: "Invalid status" });

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Status updated successfully", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.json({ success: false, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.json({ success: false, message: "Order ID is required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: "Order deleted successfully", deletedOrderId: orderId });
  } catch (error) {
    console.error("Delete order error:", error);
    res.json({ success: false, message: error.message });
  }
};

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
    console.error("Bulk delete orders error:", error);
    res.json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.json({ success: false, message: "Order ID is required" });

    const order = await orderModel.findById(orderId).populate("userId", "name email");
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);
    res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = resolveUserId(req);
    const { orderId } = req.body;
    if (!orderId || !userId) return res.json({ success: false, message: "Order ID and User ID are required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    if (order.userId.toString() !== userId) return res.json({ success: false, message: "Unauthorized action" });

    const cancellableStatuses = ["Order Placed", "Packing"];
    if (!cancellableStatuses.includes(order.status))
      return res.json({ success: false, message: "Cannot cancel order. Already shipped or delivered." });

    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
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
};
