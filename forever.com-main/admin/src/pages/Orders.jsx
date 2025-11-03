"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiPhone,
  FiCalendar,
  FiSearch,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiTrash2,
  FiBarChart2,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ComposedChart
} from 'recharts';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeChart, setActiveChart] = useState("overview");

  // Status colors
  const statusColors = {
    "Order Placed": "bg-gray-100 text-gray-800",
    "Packing": "bg-gray-200 text-gray-900",
    "Shipped": "bg-gray-300 text-black",
    "Out for delivery": "bg-gray-400 text-black",
    "Delivered": "bg-black text-white",
  };

  // Chart colors
  const COLORS = ['#000000', '#404040', '#808080', '#A0A0A0', '#C0C0C0'];

  // Analytics Data Processing - ALL REAL DATA
  const analyticsData = useMemo(() => {
    if (!orders.length) return null;

    // Status Distribution
    const statusCount = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / orders.length) * 100).toFixed(1)
    }));

    // Revenue by Status
    const revenueByStatus = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      revenueByStatus[status] = (revenueByStatus[status] || 0) + (order.amount || 0);
    });

    const revenueStatusData = Object.entries(revenueByStatus).map(([status, revenue]) => ({
      status,
      revenue: Math.round(revenue),
      orders: statusCount[status] || 0
    }));

    // Daily Orders & Revenue (Last 30 days)
    const today = new Date();
    const dailyData = {};
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyData[dateKey] = { date: dateKey, orders: 0, revenue: 0 };
    }

    orders.forEach(order => {
      const orderDate = new Date(order.date).toISOString().split('T')[0];
      if (dailyData[orderDate]) {
        dailyData[orderDate].orders += 1;
        dailyData[orderDate].revenue += order.amount || 0;
      }
    });

    const dailyTrends = Object.values(dailyData).map(day => ({
      date: new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      orders: day.orders,
      revenue: Math.round(day.revenue)
    }));

    // Payment Method Distribution
    const paymentMethods = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'Unknown';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });

    const paymentData = Object.entries(paymentMethods).map(([name, value]) => ({
      name,
      value
    }));

    // Top Cities by Orders
    const cityCount = {};
    orders.forEach(order => {
      const city = order.address?.city || 'Unknown';
      cityCount[city] = (cityCount[city] || 0) + 1;
    });

    const topCities = Object.entries(cityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({
        city: city.length > 15 ? city.substring(0, 15) + '...' : city,
        orders: count
      }));

    // Average Order Value by Status
    const avgOrderByStatus = Object.entries(revenueByStatus).map(([status, revenue]) => ({
      status,
      avgValue: Math.round(revenue / (statusCount[status] || 1))
    }));

    // Monthly Revenue (Last 6 months)
    const monthlyData = {};
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-IN', { month: 'short' });
      monthlyData[monthKey] = { month: monthName, revenue: 0, orders: 0 };
    }

    orders.forEach(order => {
      const monthKey = new Date(order.date).toISOString().slice(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += order.amount || 0;
        monthlyData[monthKey].orders += 1;
      }
    });

    const monthlyRevenue = Object.values(monthlyData).map(m => ({
      month: m.month,
      revenue: Math.round(m.revenue),
      orders: m.orders
    }));

    return {
      statusDistribution,
      revenueStatusData,
      dailyTrends,
      paymentData,
      topCities,
      avgOrderByStatus,
      monthlyRevenue
    };
  }, [orders]);

  // Auto login
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
      }
    } catch (error) {
      console.error("Admin login error:", error);
    }
  }, []);

  // Fetch orders
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
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update status
  const updateStatus = useCallback(
    async (event, id) => {
      const newStatus = event.target.value;
      setUpdatingId(id);

      try {
        const res = await axios.post(
          `${backendUrl}/api/order/status`,
          { orderId: id, status: newStatus },
          { headers: { token } }
        );

        if (res.data.success) {
          toast.success("Order status updated!");
          setOrders((prev) =>
            prev.map((order) =>
              order._id === id ? { ...order, status: newStatus } : order
            )
          );
        }
      } catch (error) {
        console.error("Update status error:", error);
        toast.error("Failed to update status");
      } finally {
        setUpdatingId(null);
      }
    },
    [token]
  );

  // Delete order
  const deleteOrder = useCallback(
    async (orderId) => {
      try {
        setUpdatingId(orderId);
        const res = await axios.post(
          `${backendUrl}/api/order/delete`,
          { orderId },
          { headers: { token } }
        );

        if (res.data.success) {
          toast.success("Order deleted!");
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
          setDeleteConfirm(null);
        }
      } catch (error) {
        console.error("Delete order error:", error);
        toast.error("Failed to delete order");
      } finally {
        setUpdatingId(null);
      }
    },
    [token]
  );

  // Toggle expand
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

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((o) => {
        const name = `${o.address?.firstName ?? ""} ${o.address?.lastName ?? ""}`.toLowerCase();
        const city = (o.address?.city ?? "").toLowerCase();
        const phone = (o.address?.phone ?? "").toLowerCase();
        return name.includes(searchLower) || city.includes(searchLower) || phone.includes(searchLower);
      });
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, search, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
    const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

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
    });
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-black text-white p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              {entry.name}: {entry.name.includes('revenue') || entry.name.includes('Revenue') ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showAnalytics ? 'bg-black text-white' : 'bg-white border border-gray-300'
          }`}
        >
          <FiBarChart2 />
          <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
        </button>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && analyticsData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Chart Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart2 },
              { id: 'trends', label: 'Trends', icon: FiTrendingUp },
              { id: 'distribution', label: 'Distribution', icon: FiPieChart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 -mb-px transition-colors ${
                  activeChart === tab.id 
                    ? 'border-b-2 border-black text-black' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <tab.icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeChart === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Status */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Revenue by Order Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.revenueStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#000000" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Cities */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Top 5 Cities by Orders</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analyticsData.topCities} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="orders" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" fill="#000000" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeChart === 'trends' && (
            <div className="space-y-6">
              {/* Daily Orders & Revenue */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Daily Orders & Revenue (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="orders" fill="#808080" radius={[4, 4, 0, 0]} name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#000000" strokeWidth={2} dot={{ fill: '#000000', r: 3 }} name="Revenue" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Revenue */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Monthly Revenue Trend (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analyticsData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#000000" fill="#000000" fillOpacity={0.2} name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {activeChart === 'distribution' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution Pie */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#000000"
                      dataKey="value"
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method Distribution */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Payment Method Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      fill="#000000"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analyticsData.paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Average Order Value by Status */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold mb-4">Average Order Value by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analyticsData.avgOrderByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgValue" fill="#404040" radius={[8, 8, 0, 0]} name="Avg Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-600">Revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
          <p className="text-sm text-gray-600">Delivered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          >
            <option value="All">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const customerName = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() || "Unknown";
            const isExpanded = expandedOrders.has(order._id);

            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{customerName}</h3>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-gray-400" />
                          <span>{order.address?.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400" />
                          <span>{order.address?.city || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-gray-400" />
                          <span className="font-bold">{formatCurrency(order.amount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                    {/* Address */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold mb-3">Delivery Address</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-medium">{order.address?.email || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Street</p>
                          <p className="font-medium">{order.address?.street || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">State</p>
                          <p className="font-medium">{order.address?.state || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Zipcode</p>
                          <p className="font-medium">{order.address?.zipcode || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h4 className="font-semibold mb-3">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                            {item.image?.[0] && (
                              <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                              </p>
                            </div>
                            <p className="font-bold">{formatCurrency(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <select
                          onChange={(event) => updateStatus(event, order._id)}
                          value={order.status}
                          disabled={updatingId === order._id}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:bg-gray-100"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(order)}
                        disabled={updatingId === order._id}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2">Delete Order?</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this order for{" "}
              {`${deleteConfirm.address?.firstName || ""} ${deleteConfirm.address?.lastName || ""}`.trim()}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(deleteConfirm._id)}
                disabled={updatingId === deleteConfirm._id}
                className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300"
              >
                {updatingId === deleteConfirm._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;