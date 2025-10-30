import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
  FiAlertCircle,
} from "react-icons/fi";

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        const sorted = (res.data.orders || []).reverse();
        setOrders(sorted);
      } else setError("Failed to load orders.");
    } catch {
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return o.status !== "Delivered" && o.status !== "Cancelled";
    if (filter === "delivered") return o.status === "Delivered";
    if (filter === "cancelled") return o.status === "Cancelled";
    return true;
  });

  const statusColor = {
    "Order Placed": "bg-blue-100 text-blue-800 border-blue-300",
    Packing: "bg-purple-100 text-purple-800 border-purple-300",
    Shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-300",
    Delivered: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Loading State
  if (loading)
    return (
      <div className="py-16 text-center">
        <div className="inline-block">
          <div className="animate-spin mb-4">
            <FiPackage className="text-gray-400 text-5xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );

  // Error State
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="bg-red-50 p-4 rounded-xl inline-block mb-4">
            <FiAlertCircle className="text-red-600 text-4xl mx-auto" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadOrders}
            className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // Not Logged In
  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6">
            <FiShoppingBag className="text-gray-400 text-5xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Sign in to your account to track and manage your orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );

  // Empty State
  if (filtered.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6">
            <FiPackage className="text-gray-400 text-5xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {filter === "all" ? "No Orders Yet" : `No ${filter} Orders`}
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            {filter === "all"
              ? "Start shopping now and your orders will appear here."
              : "Try adjusting your filters to find your orders."}
          </p>
          <button
            onClick={() =>
              filter === "all" ? navigate("/collection") : setFilter("all")
            }
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            {filter === "all" ? "Start Shopping" : "View All Orders"}
          </button>
        </div>
      </div>
    );

  // Main Content
  return (
    <div className="min-h-screen  px-4 py-10 mb-40">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-gray-600">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""} • Track and manage your purchases
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          {[
            { id: "all", label: "All", count: orders.length },
            {
              id: "pending",
              label: "Pending",
              count: orders.filter(
                (o) => o.status !== "Delivered" && o.status !== "Cancelled"
              ).length,
            },
            {
              id: "delivered",
              label: "Delivered",
              count: orders.filter((o) => o.status === "Delivered").length,
            },
            {
              id: "cancelled",
              label: "Cancelled",
              count: orders.filter((o) => o.status === "Cancelled").length,
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f.id
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {f.label}
              <span className={`ml-2 ${filter === f.id ? "text-gray-200" : "text-gray-500"}`}>
                ({f.count})
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order) => {
            const isExpanded = expanded === order._id;
            const color = statusColor[order.status] || statusColor["Order Placed"];
            return (
              <div
                key={order._id}
                className={`bg-white rounded-xl border border-gray-200 transition-all ${
                  isExpanded ? "shadow-lg border-gray-300" : "shadow-sm hover:shadow-md"
                }`}
              >
                {/* Order Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${color}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {currency}{order.amount}
                      </h3>
                      <p className="flex items-center text-sm text-gray-600 gap-2">
                        <FiCalendar className="text-gray-400 flex-shrink-0" size={16} />
                        {new Date(order.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      {isExpanded ? (
                        <>
                          <FiChevronUp size={18} />
                          <span className="hidden sm:inline">Hide</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown size={18} />
                          <span className="hidden sm:inline">Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 sm:px-6 py-6 space-y-5">
                    {/* Payment & Address */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <FiCreditCard className="text-gray-400" size={16} />
                          <p className="text-xs uppercase tracking-wider font-medium">Payment Method</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                          <FiMapPin className="text-gray-400" size={16} />
                          <p className="text-xs uppercase tracking-wider font-medium">Delivery Address</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.address?.street || "Address not available"}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-xs uppercase tracking-wider font-medium text-gray-600 mb-3">
                        Items ({order.items?.length || 0})
                      </p>
                      <div className="space-y-2">
                        {order.items?.slice(0, 2).map((item, i) => (
                          <div
                            key={i}
                            className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200"
                          >
                            <img
                              src={Array.isArray(item.image) ? item.image[0] : item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-md object-cover border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Qty: {item.quantity}
                                {item.size && ` • Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {order.items?.length > 2 && (
                        <p className="text-xs text-gray-500 mt-2 ml-1">
                          +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;