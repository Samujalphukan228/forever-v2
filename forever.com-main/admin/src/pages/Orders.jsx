"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  FiTruck,
  FiPackage,
  FiPhone,
  FiCalendar,
  FiCreditCard,
  FiSearch,
  FiMapPin,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiHome,
  FiGlobe,
  FiCheck,
  FiX,
  FiFilter,
  FiDollarSign,
  FiShoppingBag,
  FiTrendingUp,
  FiTrash2,
  FiClock,
  FiTag,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // UI States
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Status color mapping
  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-700 border-blue-300",
    "Packing": "bg-yellow-100 text-yellow-700 border-yellow-300",
    "Shipped": "bg-purple-100 text-purple-700 border-purple-300",
    "Out for delivery": "bg-orange-100 text-orange-700 border-orange-300",
    "Delivered": "bg-green-100 text-green-700 border-green-300",
  };

  // Auto login as admin
  const adminLogin = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("adminToken");
      if (storedToken) {
        setToken(storedToken);
        return;
      }
      const res = await axios.post(`${backendUrl}/api/user/admin`, {
        email: import.meta.env.VITE_ADMIN_EMAIL || "Nilutpal@forever.com",
        password: import.meta.env.VITE_ADMIN_PASSWORD || "Nilutpal123",
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("adminToken", res.data.token);
      } else {
        setError(res.data.message || "Admin login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.response?.data?.message || error.message);
    }
  }, []);

  // Fetch all orders
  const fetchOrders = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
      } else {
        setError(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      setError(error.response?.data?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update order status
  const updateStatus = useCallback(
    async (event, id, customerName) => {
      const newStatus = event.target.value;
      setUpdatingId(id);

      try {
        const res = await axios.post(
          `${backendUrl}/api/order/status`,
          { orderId: id, status: newStatus },
          { headers: { token } }
        );

        if (res.data.success) {
          setSuccessMessage(`Order for ${customerName} updated to "${newStatus}" 🎉`);
          setOrders((prev) =>
            prev.map((order) =>
              order._id === id ? { ...order, status: newStatus } : order
            )
          );
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setError(res.data.message || "Update failed");
        }
      } catch (error) {
        console.error("Update status error:", error);
        setError(error.response?.data?.message || "Failed to update status");
      } finally {
        setUpdatingId(null);
      }
    },
    [token]
  );

  // Delete order
  const deleteOrder = useCallback(
    async (orderId, customerName) => {
      try {
        setUpdatingId(orderId);
        const res = await axios.post(
          `${backendUrl}/api/order/delete`,
          { orderId },
          { headers: { token } }
        );

        if (res.data.success) {
          setSuccessMessage(`Order for ${customerName} deleted successfully! 🎉`);
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          setDeleteConfirm(null);
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setError(res.data.message || "Delete failed");
        }
      } catch (error) {
        console.error("Delete order error:", error);
        setError(error.response?.data?.message || "Failed to delete order");
      } finally {
        setUpdatingId(null);
      }
    },
    [token]
  );

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    adminLogin();
  }, [adminLogin]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  // Filtering & Sorting Logic
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((o) => {
        const name = `${o.address?.firstName ?? ""} ${o.address?.lastName ?? ""}`.toLowerCase();
        const city = (o.address?.city ?? "").toLowerCase();
        const phone = (o.address?.phone ?? "").toLowerCase();
        const email = (o.address?.email ?? "").toLowerCase();
        const itemNames = o.items?.map((i) => i.name?.toLowerCase() || "").join(" ");

        return (
          name.includes(searchLower) ||
          city.includes(searchLower) ||
          phone.includes(searchLower) ||
          email.includes(searchLower) ||
          itemNames.includes(searchLower)
        );
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    const now = new Date();
    filtered = filtered.filter((o) => {
      const orderDate = new Date(o.date);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

      switch (dateFilter) {
        case "Day":
          return diffDays < 1;
        case "Week":
          return diffDays < 7;
        case "Month":
          return diffDays < 30;
        default:
          return true;
      }
    });

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highAmount":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowAmount":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }

    return filtered;
  }, [orders, search, statusFilter, dateFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status !== "Delivered").length;
    const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
  }, [orders]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6 animate-pulse">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        {search || statusFilter !== "All" || dateFilter !== "All" ? (
          <FiSearch className="text-4xl text-gray-400" />
        ) : (
          <FiShoppingBag className="text-4xl text-gray-400" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {search || statusFilter !== "All" || dateFilter !== "All"
          ? "No orders found"
          : "No orders yet"}
      </h3>
      <p className="text-gray-500 mb-6">
        {search || statusFilter !== "All" || dateFilter !== "All"
          ? "Try adjusting your filters or search terms"
          : "Orders will appear here once customers place them"}
      </p>
      {(search || statusFilter !== "All" || dateFilter !== "All") && (
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setDateFilter("All");
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <section className="py-8 sm:py-12 px-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Order Management
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor and manage all customer orders
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <FiCheck className="text-white text-sm" />
            </div>
            <p className="text-green-800 font-medium flex-1">{successMessage}</p>
            <button onClick={() => setSuccessMessage("")} className="text-green-600 hover:text-green-800">
              <FiX />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-medium flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
              <FiX />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiShoppingBag className="text-2xl text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-2xl text-green-500" />
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Revenue
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-2xl text-orange-500" />
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                Pending
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Orders</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiCheck className="text-2xl text-green-500" />
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.deliveredOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Delivered</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by customer, phone, email, product..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all min-w-[180px]"
              >
                <option value="All">All Status</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none px-4 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="All">All Time</option>
                <option value="Day">Last 24 Hours</option>
                <option value="Week">Last 7 Days</option>
                <option value="Month">Last 30 Days</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highAmount">Amount: High → Low</option>
                <option value="lowAmount">Amount: Low → High</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters */}
          {(search || statusFilter !== "All" || dateFilter !== "All") && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: {search}
                  <button onClick={() => setSearch("")} className="ml-1">
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
              {statusFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {statusFilter}
                  <button onClick={() => setStatusFilter("All")} className="ml-1">
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
              {dateFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {dateFilter}
                  <button onClick={() => setDateFilter("All")} className="ml-1">
                    <FiX className="text-xs" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders
              {search && ` matching "${search}"`}
            </p>
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredOrders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const customerName = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() || "Unknown Customer";
              const isExpanded = expandedOrders.has(order._id);

              return (
                <div
                  key={order._id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Order Header - Always Visible */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      
                      {/* Customer Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{customerName}</h3>
                              <div className="flex flex-wrap items-center gap-3 mt-1">
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  <FiCalendar className="text-gray-400" />
                                  {formatDate(order.date)}
                                </span>
                                <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                  <FiPackage className="text-gray-400" />
                                  {order.items?.length || 0} items
                                </span>
                              </div>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 ${statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
                              {order.status}
                            </span>
                          </div>

                          {/* Quick Info - Always Visible */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{order.address?.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMail className="text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{order.address?.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{order.address?.city || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiDollarSign className="text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-bold text-gray-900">{formatCurrency(order.amount || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-700 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <FiChevronUp />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <FiChevronDown />
                            View Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t-2 border-gray-100 bg-gray-50 p-6 space-y-6">
                      
                      {/* Full Address Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiHome className="text-gray-700 text-lg" />
                          <h4 className="font-semibold text-gray-900">Delivery Address</h4>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Full Name</label>
                              <p className="text-gray-900 font-medium">{customerName}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Phone Number</label>
                              <p className="text-gray-900 font-medium">{order.address?.phone || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Email Address</label>
                              <p className="text-gray-900 font-medium">{order.address?.email || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Street Address</label>
                              <p className="text-gray-900 font-medium">{order.address?.street || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">City</label>
                              <p className="text-gray-900 font-medium">{order.address?.city || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">State</label>
                              <p className="text-gray-900 font-medium">{order.address?.state || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Zip Code</label>
                              <p className="text-gray-900 font-medium">{order.address?.zipcode || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Country</label>
                              <p className="text-gray-900 font-medium">{order.address?.country || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items - Full Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiShoppingBag className="text-gray-700 text-lg" />
                          <h4 className="font-semibold text-gray-900">Order Items ({order.items?.length || 0})</h4>
                        </div>
                        <div className="space-y-3">
                          {order.items?.map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 border-2 border-gray-200">
                              <div className="flex items-start gap-4">
                                {item.image && item.image[0] && (
                                  <img
                                    src={item.image[0]}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-900 mb-1">{item.name || "Unknown Item"}</h5>
                                  <div className="flex flex-wrap gap-3 text-sm">
                                    <span className="inline-flex items-center gap-1 text-gray-600">
                                      <FiTag className="text-gray-400" />
                                      Qty: <strong>{item.quantity || 1}</strong>
                                    </span>
                                    {item.size && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                                        Size: {item.size}
                                      </span>
                                    )}
                                    <span className="inline-flex items-center gap-1 text-gray-900 font-bold">
                                      {formatCurrency(item.price || 0)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiCreditCard className="text-gray-700 text-lg" />
                          <h4 className="font-semibold text-gray-900">Payment Information</h4>
                        </div>
                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Payment Method</label>
                              <p className="text-gray-900 font-medium">{order.paymentMethod || "N/A"}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Payment Status</label>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${
                                order.payment 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {order.payment ? "✓ Paid" : "○ Pending"}
                              </span>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 font-medium">Total Amount</label>
                              <p className="text-gray-900 font-bold text-lg">{formatCurrency(order.amount || 0)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-200">
                        {/* Status Update */}
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Update Order Status
                          </label>
                          <div className="relative">
                            <select
                              onChange={(event) => updateStatus(event, order._id, customerName)}
                              value={order.status}
                              disabled={updatingId === order._id}
                              className={`appearance-none w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all ${
                                updatingId === order._id 
                                  ? "cursor-not-allowed opacity-50 bg-gray-100" 
                                  : "cursor-pointer hover:border-blue-500 focus:border-blue-500 bg-white"
                              }`}
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Packing">Packing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for delivery">Out for delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                            <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            {updatingId === order._id && (
                              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-xl">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="sm:w-48">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Delete Order
                          </label>
                          <button
                            onClick={() => setDeleteConfirm(order)}
                            disabled={updatingId === order._id}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                              updatingId === order._id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                                : "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
                            }`}
                          >
                            <FiTrash2 />
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <FiAlertCircle className="text-red-600 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Order?
            </h3>
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to delete the order for
            </p>
            <p className="text-gray-900 font-semibold text-center mb-6">
              "{`${deleteConfirm.address?.firstName || ""} ${deleteConfirm.address?.lastName || ""}`.trim() || "Unknown Customer"}"?
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">
              This action cannot be undone. All order information will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(deleteConfirm._id, `${deleteConfirm.address?.firstName || ""} ${deleteConfirm.address?.lastName || ""}`.trim())}
                disabled={updatingId === deleteConfirm._id}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  updatingId === deleteConfirm._id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {updatingId === deleteConfirm._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Orders;
