import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import {
  FiPackage,
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
  const [refreshKey, setRefreshKey] = useState(0); // manual refresh support

  const fmt = (val) => `${currency}${Number(val || 0).toFixed(2)}`;

  // Normalize status to reduce mapping issues (e.g., "Out for delivery" vs "Out for Delivery")
  const normalizeStatus = (s = "") => {
    const t = s.trim().toLowerCase();
    if (t.includes("out") && t.includes("delivery")) return "Out for Delivery";
    if (t.includes("order") && t.includes("placed")) return "Order Placed";
    if (t.includes("pack")) return "Packing";
    if (t.includes("ship")) return "Shipped";
    if (t.includes("deliver") && !t.includes("out")) return "Delivered";
    if (t.includes("cancel")) return "Cancelled";
    return s || "Order Placed";
  };

  const statusColor = {
    "Order Placed": "bg-blue-100 text-blue-800 border-blue-300",
    Packing: "bg-purple-100 text-purple-800 border-purple-300",
    Shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-300",
    Delivered: "bg-green-100 text-green-800 border-green-300",
    Cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    const controller = new AbortController();

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token }, signal: controller.signal }
      );

      if (res.data?.success) {
        // newest first
        const sorted = (res.data.orders || []).sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sorted);
      } else {
        setError(res.data?.message || "Failed to load orders.");
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      setError(err?.response?.data?.message || "Error fetching orders.");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrders();
  }, [token, refreshKey, loadOrders]);

  // Counts and filtered list (memoized)
  const counts = useMemo(() => {
    const all = orders.length;
    const delivered = orders.filter((o) => normalizeStatus(o.status) === "Delivered").length;
    const cancelled = orders.filter((o) => normalizeStatus(o.status) === "Cancelled").length;
    const pending = orders.filter(
      (o) => !["Delivered", "Cancelled"].includes(normalizeStatus(o.status))
    ).length;
    return { all, delivered, cancelled, pending };
  }, [orders]);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "pending")
      return orders.filter(
        (o) => !["Delivered", "Cancelled"].includes(normalizeStatus(o.status))
      );
    if (filter === "delivered")
      return orders.filter((o) => normalizeStatus(o.status) === "Delivered");
    if (filter === "cancelled")
      return orders.filter((o) => normalizeStatus(o.status) === "Cancelled");
    return orders;
  }, [orders, filter]);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  // Loading
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );

  // Error
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 flex items-center justify-center mx-auto mb-4 rounded">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-lg font-medium text-black mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="px-6 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // Not logged in
  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mx-auto mb-6 rounded">
            <FiShoppingBag className="text-black text-3xl" />
          </div>
          <h2 className="text-2xl font-light text-black mb-2">Login Required</h2>
          <p className="text-gray-600 mb-8 max-w-sm font-light">
            Sign in to your account to track and manage your orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
          >
            Login to Account
          </button>
        </div>
      </div>
    );

  // Empty state
  if (filtered.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-50 flex items-center justify-center mx-auto mb-6 rounded">
            <FiPackage className="text-black text-3xl" />
          </div>
          <h2 className="text-2xl font-light text-black mb-2">
            {filter === "all" ? "No Orders Yet" : `No ${filter} Orders`}
          </h2>
          <p className="text-gray-600 mb-8 max-w-sm font-light">
            {filter === "all"
              ? "Start shopping now and your orders will appear here."
              : "Try adjusting your filters to find your orders."}
          </p>
          <button
            onClick={() => (filter === "all" ? navigate("/collection") : setFilter("all"))}
            className="px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-gray-800 transition-colors"
          >
            {filter === "all" ? "Start Shopping" : "View All Orders"}
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen  pt-24 lg:pt-28  pb-12">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extralight text-black mb-2">My Orders</h1>
          <p className="text-gray-600 font-light">
            {filtered.length} order{filtered.length !== 1 ? "s" : ""} • Track and manage your purchases
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[
            { id: "all", label: "All", count: counts.all },
            { id: "pending", label: "Pending", count: counts.pending },
            { id: "delivered", label: "Delivered", count: counts.delivered },
            { id: "cancelled", label: "Cancelled", count: counts.cancelled },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                filter === f.id ? "bg-black text-white" : "bg-white text-black border border-gray-200 hover:border-black"
              }`}
              aria-pressed={filter === f.id}
            >
              {f.label}
              <span className="ml-2 text-gray-400">({f.count})</span>
            </button>
          ))}

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="ml-auto px-5 py-2 text-xs uppercase tracking-[0.15em] font-medium bg-white text-black border border-gray-200 hover:border-black transition-all"
          >
            Refresh
          </button>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filtered.map((order) => {
            const status = normalizeStatus(order.status);
            const pill = statusColor[status] || statusColor["Order Placed"];
            const isExpanded = expanded === order._id;
            const panelId = `order-panel-${order._id}`;
            const shortId = order._id?.slice(-8).toUpperCase();

            return (
              <div
                key={order._id}
                className={`bg-white border border-gray-200 transition-all ${isExpanded ? "border-gray-300" : "hover:border-gray-300"}`}
              >
                {/* Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-3">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                          Order #{shortId}
                        </p>
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium border ${pill}`}>
                          {status}
                        </span>
                      </div>
                      <h3 className="text-2xl font-light text-black mb-2">{fmt(order.amount)}</h3>
                      <p className="flex items-center text-sm text-gray-600 gap-2 font-light">
                        <FiCalendar className="text-gray-400 w-4 h-4" />
                        {new Date(order.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleExpand(order._id)}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-xs uppercase tracking-[0.15em] font-medium text-black hover:border-black transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <FiChevronUp className="w-4 h-4" />
                          <span className="hidden sm:inline">Hide</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="w-4 h-4" />
                          <span className="hidden sm:inline">Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Panel */}
                {isExpanded && (
                  <div
                    id={panelId}
                    className="border-t border-gray-200 bg-[#fafafa] px-5 sm:px-6 py-6 space-y-5"
                  >
                    {/* Payment & Address */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FiCreditCard className="text-gray-400 w-4 h-4" />
                          <p className="text-[10px] uppercase tracking-[0.2em] font-medium">Payment</p>
                        </div>
                        <p className="text-sm font-medium text-black">
                          {order.paymentMethod || "—"}
                        </p>
                      </div>
                      <div className="bg-white p-4 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <FiMapPin className="text-gray-400 w-4 h-4" />
                          <p className="text-[10px] uppercase tracking-[0.2em] font-medium">Delivery</p>
                        </div>
                        <p className="text-sm font-medium text-black">
                          {[
                            order.address?.street,
                            order.address?.city,
                            order.address?.state,
                            order.address?.zipcode,
                            order.address?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Address not available"}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-gray-600 mb-3">
                        Items ({order.items?.length || 0})
                      </p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex gap-3 bg-white p-3 border border-gray-200">
                            <img
                              src={Array.isArray(item.image) ? item.image[0] : item.image}
                              alt={item.name}
                              className="w-14 h-14 object-cover border border-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-black truncate">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-1 font-light">
                                Qty: {item.quantity}
                                {item.size && ` • Size: ${item.size}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
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