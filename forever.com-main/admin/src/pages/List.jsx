"use client";


import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { FiTrash2, FiSearch, FiX, FiGrid, FiList, FiBarChart2, FiTrendingUp, FiPieChart, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const List = () => {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState("");
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

  // Analytics Data Processing - ALL REAL DATA
  const analyticsData = useMemo(() => {
    if (!list.length) return null;

    // Price Distribution (REAL)
    const priceRanges = {
      '0-500': 0,
      '501-1000': 0,
      '1001-2000': 0,
      '2000+': 0
    };
    
    list.forEach(item => {
      const price = item.price || 0;
      if (price <= 500) priceRanges['0-500']++;
      else if (price <= 1000) priceRanges['501-1000']++;
      else if (price <= 2000) priceRanges['1001-2000']++;
      else priceRanges['2000+']++;
    });

    const priceDistribution = Object.entries(priceRanges).map(([range, count]) => ({
      range: isMobile ? range.replace('-', '-\n') : range,
      count,
      percentage: ((count / list.length) * 100).toFixed(1)
    }));

    // Category Distribution (REAL)
    const categoryCount = {};
    list.forEach(item => {
      const cat = item.category || 'Uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCount)
      .slice(0, isMobile ? 4 : 6) // Limit categories on mobile
      .map(([name, value]) => ({
        name: isMobile && name.length > 8 ? name.substring(0, 8) + '..' : name,
        value,
        percentage: ((value / list.length) * 100).toFixed(1)
      }));

    // Top Products by Price (REAL)
    const topProducts = [...list]
      .sort((a, b) => b.price - a.price)
      .slice(0, isMobile ? 3 : 5)
      .map(item => ({
        name: item.name.length > (isMobile ? 12 : 20) 
          ? item.name.substring(0, isMobile ? 12 : 20) + '...' 
          : item.name,
        price: item.price
      }));

    // Real Price Trends - Cumulative value and running average (REAL DATA)
    const priceTrends = list.map((item, index) => {
      const previousItems = list.slice(0, index + 1);
      const cumulativeValue = previousItems.reduce((sum, p) => sum + p.price, 0);
      const runningAvg = cumulativeValue / (index + 1);
      
      return {
        index: index + 1,
        product: item.name.substring(0, 15),
        cumulativeValue: Math.round(cumulativeValue),
        runningAvg: Math.round(runningAvg),
        currentPrice: item.price
      };
    });

    // Take every nth item for cleaner chart (max points based on screen size)
    const maxPoints = isMobile ? 5 : 10;
    const step = Math.ceil(priceTrends.length / maxPoints);
    const sampledTrends = priceTrends.filter((_, index) => index % step === 0);

    // Category Performance (REAL)
    const categoryPerformance = Object.entries(categoryCount)
      .slice(0, isMobile ? 4 : 6)
      .map(([category, count]) => {
        const categoryProducts = list.filter(p => p.category === category);
        const totalValue = categoryProducts.reduce((sum, p) => sum + p.price, 0);
        
        return {
          category: category.length > (isMobile ? 6 : 10) 
            ? category.substring(0, isMobile ? 6 : 10) + '..' 
            : category,
          products: count,
          avgPrice: Math.round(totalValue / count),
          totalValue: Math.round(totalValue)
        };
      });

    // Size Distribution (REAL)
    const sizeCount = {};
    list.forEach(item => {
      if (item.sizes && Array.isArray(item.sizes)) {
        item.sizes.forEach(size => {
          sizeCount[size] = (sizeCount[size] || 0) + 1;
        });
      }
    });

    const sizeDistribution = Object.entries(sizeCount).map(([size, count]) => ({
      size,
      count
    }));

    // Bestseller vs Regular (REAL)
    const bestsellerCount = list.filter(p => p.bestseller).length;
    const regularCount = list.length - bestsellerCount;
    const bestsellerData = [
      { name: 'Bestseller', value: bestsellerCount },
      { name: 'Regular', value: regularCount }
    ];

    return {
      priceDistribution,
      categoryData,
      topProducts,
      priceTrends: sampledTrends,
      categoryPerformance,
      sizeDistribution,
      bestsellerData,
      totalValue: list.reduce((sum, item) => sum + (item.price || 0), 0),
      avgPrice: list.reduce((sum, item) => sum + (item.price || 0), 0) / list.length,
      priceRange: {
        min: Math.min(...list.map(p => p.price)),
        max: Math.max(...list.map(p => p.price))
      }
    };
  }, [list, isMobile]);

  // Admin login
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
        localStorage.setItem("adminToken", res.data.token);
        setToken(res.data.token);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.message);
    }
  }, []);

  // Fetch product list
  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${backendUrl}/api/product/list`);

      if (res.data.success) {
        setList(res.data.products || []);
        setFiltered(res.data.products || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setList([]);
      setFiltered([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove product
  const removeProduct = useCallback(
    async (id) => {
      if (!token) {
        await adminLogin();
        return;
      }

      setDeletingId(id);
      try {
        const res = await axios.post(
          `${backendUrl}/api/product/remove`,
          { id },
          { headers: { token } }
        );

        if (res.data.success) {
          setList((prev) => prev.filter((item) => item._id !== id));
          setFiltered((prev) => prev.filter((item) => item._id !== id));
          setDeleteConfirm(null);
        }
      } catch (error) {
        console.error("Delete error:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          await adminLogin();
        }
      } finally {
        setDeletingId(null);
      }
    },
    [token, adminLogin]
  );

  // Search & Sort
  useEffect(() => {
    let filteredList = [...list];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredList = filteredList.filter((p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower)
      );
    }

    switch (sortBy) {
      case "name":
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceLowHigh":
        filteredList.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filteredList.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFiltered(filteredList);
  }, [search, sortBy, list]);

  // Initial load
  useEffect(() => {
    adminLogin();
  }, [adminLogin]);

  useEffect(() => {
    if (token) {
      fetchList();
    }
  }, [token, fetchList]);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-black text-white p-2 md:p-3 rounded-lg shadow-lg border border-gray-800 text-xs md:text-sm">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie Chart Colors
  const COLORS = ['#000000', '#404040', '#808080', '#A0A0A0', '#C0C0C0'];

  return (
    <div className="max-w-7xl mx-auto ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Product List</h1>
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
              { id: 'distribution', label: 'Distribution', icon: FiPieChart },
              { id: 'trends', label: 'Trends', icon: FiTrendingUp }
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
              {/* Price Distribution Bar Chart */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Price Distribution</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                  <BarChart data={analyticsData.priceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="range" 
                      tick={{ fontSize: isMobile ? 10 : 12 }} 
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? "end" : "middle"}
                      height={isMobile ? 60 : 30}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#000000" radius={[8, 8, 0, 0]}>
                      {analyticsData.priceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products Bar Chart */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Top Products by Price</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 250}>
                  <BarChart 
                    data={analyticsData.topProducts} 
                    layout={isMobile ? "vertical" : "horizontal"}
                    margin={isMobile ? { left: 50 } : { left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    {isMobile ? (
                      <>
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={45} />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="price" tick={{ fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                      </>
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="price" fill="#000000" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Distribution Tab */}
          {activeChart === 'distribution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Category Pie Chart */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={isMobile ? false : ({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#000000"
                      dataKey="value"
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Mobile Legend */}
                {isMobile && (
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    {analyticsData.categoryData.map((item, index) => (
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

              {/* Bestseller vs Regular Pie Chart */}
              <div>
                <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Product Status</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.bestsellerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={isMobile ? 30 : 40}
                      outerRadius={isMobile ? 60 : 80}
                      fill="#000000"
                      dataKey="value"
                      label={({ name, value }) => isMobile ? value : `${name}: ${value}`}
                    >
                      {analyticsData.bestsellerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#000000' : '#808080'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {isMobile && (
                  <div className="flex gap-4 justify-center mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-black rounded" />
                      <span>Bestseller</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-500 rounded" />
                      <span>Regular</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Size Distribution Bar Chart (if sizes exist) */}
              {analyticsData.sizeDistribution.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Size Distribution</h3>
                  <ResponsiveContainer width="100%" height={isMobile ? 150 : 200}>
                    <BarChart data={analyticsData.sizeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="size" tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#404040" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Trends Tab */}
          {activeChart === 'trends' && (
            <div>
              <h3 className="text-xs md:text-sm font-semibold mb-2 md:mb-4">Cumulative Value & Running Average</h3>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
                <LineChart data={analyticsData.priceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="index" 
                    label={!isMobile && { value: 'Product Index', position: 'insideBottom', offset: -5 }} 
                    tick={{ fontSize: isMobile ? 10 : 12 }} 
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 40 : 60} />
                  {!isMobile && <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
                    iconSize={isMobile ? 10 : 18}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="cumulativeValue" 
                    stroke="#000000" 
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ fill: '#000000', r: isMobile ? 2 : 4 }}
                    name="Cumulative"
                  />
                  <Line 
                    yAxisId={isMobile ? "left" : "right"}
                    type="monotone" 
                    dataKey="runningAvg" 
                    stroke="#808080" 
                    strokeWidth={isMobile ? 1.5 : 2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#808080', r: isMobile ? 2 : 4 }}
                    name="Avg"
                  />
                  {!isMobile && (
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="currentPrice" 
                      stroke="#C0C0C0" 
                      strokeWidth={1}
                      dot={{ fill: '#C0C0C0', r: 3 }}
                      name="Price"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>

              {/* Category Performance Radar - Hide on mobile */}
              {!isMobile && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-4">Category Performance Matrix</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={analyticsData.categoryPerformance}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fontSize: 10 }} />
                      <Radar name="Products" dataKey="products" stroke="#000000" fill="#000000" fillOpacity={0.3} />
                      <Radar name="Total Value" dataKey="totalValue" stroke="#808080" fill="#808080" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Analytics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
            <div>
              <p className="text-[10px] md:text-xs text-gray-600">Total Value</p>
              <p className="text-sm md:text-xl font-bold">{currency}{analyticsData.totalValue.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-600">Avg Price</p>
              <p className="text-sm md:text-xl font-bold">{currency}{analyticsData.avgPrice.toFixed(0)}</p>
            </div>
            <div className={isMobile ? "hidden" : ""}>
              <p className="text-xs text-gray-600">Price Range</p>
              <p className="text-xl font-bold">{currency}{analyticsData.priceRange.min}-{analyticsData.priceRange.max}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-600">Categories</p>
              <p className="text-sm md:text-xl font-bold">{analyticsData.categoryData.length}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-gray-600">Bestsellers</p>
              <p className="text-sm md:text-xl font-bold">{analyticsData.bestsellerData[0].value}/{list.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-2 md:p-4">
          <p className="text-lg md:text-2xl font-bold">{list.length}</p>
          <p className="text-[10px] md:text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2 md:p-4">
          <p className="text-lg md:text-2xl font-bold">
            {currency}{list.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(0)}
          </p>
          <p className="text-[10px] md:text-sm text-gray-600">Total Value</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-2 md:p-4">
          <p className="text-lg md:text-2xl font-bold">
            {currency}{list.length > 0 ? (list.reduce((sum, item) => sum + (item.price || 0), 0) / list.length).toFixed(0) : '0'}
          </p>
          <p className="text-[10px] md:text-sm text-gray-600">Avg Price</p>
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
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm md:text-base"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm md:text-base"
            >
              <option value="">Default Sort</option>
              <option value="name">Name (A-Z)</option>
              <option value="priceLowHigh">Price (Low-High)</option>
              <option value="priceHighLow">Price (High-Low)</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-black text-white" : "bg-gray-100"}`}
              >
                <FiGrid className="text-sm md:text-base" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-black text-white" : "bg-gray-100"}`}
              >
                <FiList className="text-sm md:text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {isLoading ? (
        <div className="text-center py-12 text-sm md:text-base">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 md:p-12 text-center">
          <p className="text-gray-600 text-sm md:text-base">No products found</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {filtered.map((item) => (
                <div key={item._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 md:h-48 bg-gray-100">
                    {item.image?.[0] ? (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs md:text-base">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-2 md:p-4">
                    <h3 className="font-semibold mb-1 text-xs md:text-base line-clamp-1">{item.name}</h3>
                    <p className="text-gray-600 text-[10px] md:text-sm mb-1 md:mb-2">{item.category}</p>
                    <p className="font-bold mb-2 md:mb-3 text-sm md:text-base">{currency}{item.price}</p>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      disabled={deletingId === item._id}
                      className="w-full py-1.5 md:py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300 text-xs md:text-base"
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mobile-friendly table view
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {isMobile ? (
                // Card-based list for mobile
                <div className="divide-y">
                  {filtered.map((item) => (
                    <div key={item._id} className="p-3 flex items-center gap-3">
                      <div className="w-12 h-12 flex-shrink-0">
                        {item.image?.[0] ? (
                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400">
                            No
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.category || "-"}</p>
                        <p className="font-semibold text-sm">{currency}{item.price}</p>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        disabled={deletingId === item._id}
                        className="p-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // Regular table for desktop
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4">Image</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="p-4">
                            {item.image?.[0] ? (
                              <img
                                src={item.image[0]}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                                No
                              </div>
                            )}
                          </td>
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4 text-gray-600">{item.category || "-"}</td>
                          <td className="p-4 font-semibold">{currency}{item.price}</td>
                          <td className="p-4">
                            <button
                              onClick={() => setDeleteConfirm(item)}
                              disabled={deletingId === item._id}
                              className="p-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold mb-2">Delete Product?</h3>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              Are you sure you want to delete "{deleteConfirm.name}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 md:px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(deleteConfirm._id)}
                disabled={deletingId === deleteConfirm._id}
                className="flex-1 px-3 md:px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-300 text-sm md:text-base"
              >
                {deletingId === deleteConfirm._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
