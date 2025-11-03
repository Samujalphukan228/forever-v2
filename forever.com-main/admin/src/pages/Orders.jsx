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
  FiMail,
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      name: isMobile && name.length > 10 ? name.substring(0, 10) + '..' : name,
      value,
      percentage: ((value / orders.length) * 100).toFixed(1)
    }));

    // Revenue by Status
    const revenueByStatus = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      revenueByStatus[status] = (revenueByStatus[status] || 0) + (order.amount || 0);
    });

    const revenueStatusData = Object.entries(revenueByStatus)
      .slice(0, isMobile ? 4 : 6)
      .map(([status, revenue]) => ({
        status: isMobile && status.length > 8 ? status.substring(0, 8) + '..' : status,
        revenue: Math.round(revenue),
        orders: statusCount[status] || 0
      }));

    // Daily Orders & Revenue (Last 30 days - sample for mobile)
    const today = new Date();
    const daysToShow = isMobile ? 7 : 30;
    const dailyData = {};
    
    for (let i = daysToShow - 1; i >= 0; i--) {
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
      date: new Date(day.date).toLocaleDateString('en-IN', { 
        month: isMobile ? 'numeric' : 'short', 
        day: 'numeric' 
      }),
      orders: day.orders,
      revenue: Math.round(day.revenue)
    }));

    // Payment Method Distribution
    const paymentMethods = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'Unknown';
      paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });

    const paymentData = Object.entries(paymentMethods)
      .slice(0, isMobile ? 3 : 5)
      .map(([name, value]) => ({
        name: isMobile && name.length > 8 ? name.substring(0, 8) + '..' : name,
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
      .slice(0, isMobile ? 3 : 5)
      .map(([city, count]) => ({
        city: city.length > (isMobile ? 10 : 15) 
          ? city.substring(0, isMobile ? 10 : 15) + '..' 
          : city,
        orders: count
      }));

    // Average Order Value by Status
    const avgOrderByStatus = Object.entries(revenueByStatus)
      .slice(0, isMobile ? 4 : 6)
      .map(([status, revenue]) => ({
        status: isMobile && status.length > 8 ? status.substring(0, 8) + '..' : status,
        avgValue: Math.round(revenue / (statusCount[status] || 1))
      }));

    // Monthly Revenue (Last 6 months)
    const monthsToShow = isMobile ? 3 : 6;
    const monthlyData = {};
    for (let i = monthsToShow - 1; i >= 0; i--) {
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
  }, [orders, isMobile]);

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

  // Format currency short for mobile
  const formatCurrencyShort = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: isMobile ? "numeric" : "short",
      day: "numeric",
      year: isMobile ? "2-digit" : "numeric",
    });
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-black text-white p-2 md:p-3 rounded-lg shadow-lg text-xs md:text-sm">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index}>
              {entry.name}: {entry.name.includes('revenue') || entry.name.includes('Revenue') 
                ? (isMobile ? formatCurrencyShort(entry.value) : formatCurrency(entry.value))
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Orders</h1>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base ${
            showAnalytics ? 'bg-black text-white' : 'bg-white border border-gray-300'
          }`}
        >
          <FiBarChart2 className="text-sm md:text-base" />
          <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
        </button>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && analyticsData && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6 mb-4 md:mb-6">
          {/* Chart Tabs - Horizontal scroll on mobile */}
          <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart2 },
              { id: 'trends', label: 'Trends', icon: FiTrendingUp },
              { id: 'distribution', label: 'Distribution', icon: FiPieChart }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 -mb-px transition-colors whitespace-nowrap text-sm md:text-base ${
                  activeChart === tab.id 
                    ? 'border-b-2 border-black text-black' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <tab.icon className="text-xs md:text-sm" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeChart === 'overview' && (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {/* Revenue by Status */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Revenue by Order Status</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                  <BarChart data={analyticsData.revenueStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="status" 
                      tick={{ fontSize: isMobile ? 9 : 11 }}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 30}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 50 : 60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#000000" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Cities */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Top Cities by Orders</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 250}>
                  <BarChart 
                    data={analyticsData.topCities} 
                    layout={isMobile ? "vertical" : "horizontal"}
                    margin={isMobile ? { left: 50 } : { left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    {isMobile ? (
                      <>
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis dataKey="city" type="category" tick={{ fontSize: 9 }} width={45} />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="orders" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={100} />
                      </>
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" fill="#000000" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeChart === 'trends' && (
            <div className="space-y-4 md:space-y-6">
              {/* Daily Orders & Revenue */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">
                  {isMobile ? 'Weekly' : 'Daily'} Orders & Revenue
                </h3>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                  <ComposedChart data={analyticsData.dailyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: isMobile ? 9 : 10 }}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 50 : 30}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 35 : 50} />
                    {!isMobile && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
                      iconSize={isMobile ? 10 : 18}
                    />
                    <Bar yAxisId="left" dataKey="orders" fill="#808080" radius={[4, 4, 0, 0]} name="Orders" />
                    <Line 
                      yAxisId={isMobile ? "left" : "right"} 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#000000" 
                      strokeWidth={isMobile ? 1.5 : 2} 
                      dot={{ fill: '#000000', r: isMobile ? 2 : 3 }} 
                      name="Revenue" 
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Revenue */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">
                  Monthly Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 250}>
                  <AreaChart data={analyticsData.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 45 : 60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#000000" 
                      fill="#000000" 
                      fillOpacity={0.2} 
                      name="Revenue" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {activeChart === 'distribution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Status Distribution Pie */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={isMobile ? false : ({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={isMobile ? 60 : 80}
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
                {/* Mobile Legend */}
                {isMobile && (
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    {analyticsData.statusDistribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name} ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Method Distribution */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Payment Methods</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 30 : 40}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#000000"
                      dataKey="value"
                      label={({ value }) => value}
                    >
                      {analyticsData.paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Mobile Legend */}
                {isMobile && (
                  <div className="flex flex-wrap gap-2 mt-2 text-xs justify-center">
                    {analyticsData.paymentData.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Average Order Value by Status - Full width on mobile */}
              <div className="md:col-span-2">
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Average Order Value by Status</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
                  <BarChart data={analyticsData.avgOrderByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="status" 
                      tick={{ fontSize: isMobile ? 9 : 11 }}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 50 : 30}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 45 : 60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgValue" fill="#404040" radius={[8, 8, 0, 0]} name="Avg Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <p className="text-lg md:text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-[10px] md:text-sm text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <p className="text-lg md:text-2xl font-bold">
            {isMobile ? formatCurrencyShort(stats.totalRevenue) : formatCurrency(stats.totalRevenue)}
          </p>
          <p className="text-[10px] md:text-sm text-gray-600">Revenue</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <p className="text-lg md:text-2xl font-bold">{stats.pendingOrders}</p>
          <p className="text-[10px] md:text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <p className="text-lg md:text-2xl font-bold">{stats.deliveredOrders}</p>
          <p className="text-[10px] md:text-sm text-gray-600">Delivered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm md:text-base" />
            <input
              type="text"
              placeholder={isMobile ? "Search orders..." : "Search by customer, phone, city..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm md:text-base"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm md:text-base"
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
        <div className="text-center py-12 text-sm md:text-base">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
          <p className="text-gray-600 text-sm md:text-base">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredOrders.map((order) => {
            const customerName = `${order.address?.firstName || ""} ${order.address?.lastName || ""}`.trim() || "Unknown";
            const isExpanded = expandedOrders.has(order._id);

            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="p-3 md:p-4">
                  <div className="flex items-start justify-between gap-2 md:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                        <h3 className="text-base md:text-lg font-bold truncate">{customerName}</h3>
                        <span className={`inline-block px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        <div className="flex items-center gap-1 md:gap-2">
                          <FiCalendar className="text-gray-400 flex-shrink-0 text-xs md:text-sm" />
                          <span className="truncate">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <FiPhone className="text-gray-400 flex-shrink-0 text-xs md:text-sm" />
                          <span className="truncate">{order.address?.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <FiMapPin className="text-gray-400 flex-shrink-0 text-xs md:text-sm" />
                          <span className="truncate">{order.address?.city || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <FiDollarSign className="text-gray-400 flex-shrink-0 text-xs md:text-sm" />
                          <span className="font-bold truncate">
                            {isMobile ? formatCurrencyShort(order.amount || 0) : formatCurrency(order.amount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderExpansion(order._id)}
                      className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg"
                    >
                      {isExpanded ? <FiChevronUp className="text-sm md:text-base" /> : <FiChevronDown className="text-sm md:text-base" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-3 md:p-4 space-y-3 md:space-y-4">
                    {/* Address */}
                    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                      <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Delivery Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                        <div>
                          <p className="text-gray-600 flex items-center gap-1">
                            <FiMail className="text-xs" />
                            Email
                          </p>
                          <p className="font-medium truncate">{order.address?.email || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Street</p>
                          <p className="font-medium truncate">{order.address?.street || "N/A"}</p>
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
                    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                      <h4 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Items ({order.items?.length || 0})</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 md:gap-3 p-2 bg-gray-50 rounded">
                            {item.image?.[0] && (
                              <img 
                                src={item.image[0]} 
                                alt={item.name} 
                                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded flex-shrink-0" 
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs md:text-sm truncate">{item.name}</p>
                              <p className="text-[10px] md:text-xs text-gray-600">
                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                              </p>
                            </div>
                            <p className="font-bold text-xs md:text-sm">
                              {isMobile ? formatCurrencyShort(item.price) : formatCurrency(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 md:gap-3">
                      <div className="flex-1">
                        <select
                          onChange={(event) => updateStatus(event, order._id)}
                          value={order.status}
                          disabled={updatingId === order._id}
                          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:bg-gray-100 text-sm md:text-base"
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
                        className="px-3 md:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300"
                      >
                        <FiTrash2 className="text-sm md:text-base" />
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
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-2">Delete Order?</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Are you sure you want to delete this order for{" "}
              {`${deleteConfirm.address?.firstName || ""} ${deleteConfirm.address?.lastName || ""}`.trim()}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 md:px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOrder(deleteConfirm._id)}
                disabled={updatingId === deleteConfirm._id}
                className="flex-1 px-3 md:px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300 text-sm md:text-base"
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