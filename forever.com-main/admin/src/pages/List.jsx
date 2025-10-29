"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { 
  FiTrash2, 
  FiSearch, 
  FiChevronDown, 
  FiPackage, 
  FiAlertCircle,
  FiGrid,
  FiList,
  FiFilter,
  FiTag,
  FiDollarSign,
  FiCheck,
  FiX,
  FiImage,
  FiTrendingUp,
  FiEdit2,
  FiEye
} from "react-icons/fi";

const List = () => {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ["all"];
    const uniqueCats = [...new Set(list.map(p => p.category).filter(Boolean))];
    return [...cats, ...uniqueCats];
  }, [list]);

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
      } else {
        setError("Admin login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.response?.data?.message || error.message);
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
      } else {
        setError(res.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || "Failed to load products");
      setList([]);
      setFiltered([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove product
  const removeProduct = useCallback(
    async (id, productName) => {
      if (!token) {
        setError("Admin token missing. Logging in again...");
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
          setSuccessMessage(`"${productName}" deleted successfully! 🎉`);
          setList((prev) => prev.filter((item) => item._id !== id));
          setFiltered((prev) => prev.filter((item) => item._id !== id));
          setDeleteConfirm(null);
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setError(res.data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Delete error:", error);

        if (error.response?.status === 401) {
          setError("Session expired. Logging in again...");
          localStorage.removeItem("adminToken");
          await adminLogin();
        } else {
          setError(error.response?.data?.message || "Failed to delete product");
        }
      } finally {
        setDeletingId(null);
      }
    },
    [token, adminLogin]
  );

  // Search, Sort & Filter
  useEffect(() => {
    const timer = setTimeout(() => {
      let filteredList = [...list];

      // Category filter
      if (selectedCategory !== "all") {
        filteredList = filteredList.filter(p => p.category === selectedCategory);
      }

      // Search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredList = filteredList.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower) ||
            p.subCategory?.toLowerCase().includes(searchLower)
        );
      }

      // Sorting
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
        case "newest":
          filteredList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      setFiltered(filteredList);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, sortBy, selectedCategory, list]);

  // Initial load
  useEffect(() => {
    adminLogin();
  }, [adminLogin]);

  useEffect(() => {
    if (token) {
      fetchList();
    }
  }, [token, fetchList]);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className={`grid gap-6 ${viewMode === "grid" ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-8 sm:py-12 px-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Product Inventory
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage your product catalog with ease
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
              <FiPackage className="text-2xl text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{list.length}</p>
            <p className="text-sm text-gray-500 mt-1">Products</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-2xl text-green-500" />
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Value
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {currency}{list.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Value</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-purple-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiTag className="text-2xl text-purple-500" />
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                Categories
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
            <p className="text-sm text-gray-500 mt-1">Unique</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FiTrendingUp className="text-2xl text-orange-500" />
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                Average
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {currency}{list.length > 0 ? (list.reduce((sum, item) => sum + (item.price || 0), 0) / list.length).toFixed(2) : '0'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Price</p>
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
                  placeholder="Search products by name, category..."
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

            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 cursor-pointer transition-all"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
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
                <option value="">Default Sort</option>
                <option value="name">Name (A→Z)</option>
                <option value="priceLowHigh">Price (Low→High)</option>
                <option value="priceHighLow">Price (High→Low)</option>
                <option value="newest">Newest First</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "grid" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiGrid className="text-xl" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === "list" 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiList className="text-xl" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
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
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="ml-1">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}
            {sortBy && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Sort: {sortBy}
                <button onClick={() => setSortBy("")} className="ml-1">
                  <FiX className="text-xs" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Products Display */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              {search || selectedCategory !== "all" ? (
                <FiSearch className="text-4xl text-gray-400" />
              ) : (
                <FiPackage className="text-4xl text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {search || selectedCategory !== "all" ? "No products found" : "No products yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {search || selectedCategory !== "all" 
                ? "Try adjusting your filters or search terms" 
                : "Start by adding your first product to the inventory"}
            </p>
            {(search || selectedCategory !== "all") && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory("all"); }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> products
                {search && ` for "${search}"`}
              </p>
            </div>

            {/* Grid View */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {item.image?.[0] ? (
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <FiImage className="text-5xl mb-2" />
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-50 transition-all">
                          <FiEye className="text-gray-700" />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-50 transition-all">
                          <FiEdit2 className="text-gray-700" />
                        </button>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-gray-900">
                          {currency}{item.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.category && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                              <FiTag className="text-[10px]" />
                              {item.category}
                            </span>
                          )}
                          {item.bestseller && (
                            <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                              <FiTrendingUp className="text-[10px]" />
                              Bestseller
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sizes */}
                      {item.sizes && item.sizes.length > 0 && (
                        <div className="flex gap-1 mb-4">
                          {item.sizes.map((size, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        disabled={deletingId === item._id}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                          deletingId === item._id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        }`}
                      >
                        <FiTrash2 />
                        {deletingId === item._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_1fr_150px] gap-4 p-4 bg-gray-50 border-b-2 border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">Image</span>
                  <span className="text-sm font-semibold text-gray-700">Product Name</span>
                  <span className="text-sm font-semibold text-gray-700">Category</span>
                  <span className="text-sm font-semibold text-gray-700">Price</span>
                  <span className="text-sm font-semibold text-gray-700">Sizes</span>
                  <span className="text-sm font-semibold text-gray-700 text-center">Actions</span>
                </div>

                {filtered.map((item, index) => (
                  <div
                    key={item._id}
                    className={`grid grid-cols-1 md:grid-cols-[80px_2fr_1fr_1fr_1fr_150px] gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    {/* Image */}
                    <div className="flex justify-center md:justify-start">
                      {item.image?.[0] ? (
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center">
                          <FiPackage className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      {item.bestseller && (
                        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium w-fit mt-1">
                          <FiTrendingUp className="text-[10px]" />
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <div className="flex items-center">
                      {item.category && (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          <FiTag className="text-[10px]" />
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900">
                        {currency}{item.price}
                      </span>
                    </div>

                    {/* Sizes */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.sizes && item.sizes.length > 0 ? (
                        item.sizes.map((size, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                            {size}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item)}
                        disabled={deletingId === item._id}
                        className={`p-2 rounded-lg transition-all ${
                          deletingId === item._id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
              Delete Product?
            </h3>
            <p className="text-gray-600 text-center mb-2">
              Are you sure you want to delete
            </p>
            <p className="text-gray-900 font-semibold text-center mb-6">
              "{deleteConfirm.name}"?
            </p>
            <p className="text-sm text-gray-500 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(deleteConfirm._id, deleteConfirm.name)}
                disabled={deletingId === deleteConfirm._id}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  deletingId === deleteConfirm._id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {deletingId === deleteConfirm._id ? "Deleting..." : "Delete"}
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

export default List;