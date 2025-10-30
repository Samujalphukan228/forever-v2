import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOrders, setUserOrders] = useState([]); // ✅ Add this
  const navigate = useNavigate();

  // --------------------------
  // 🔹 Fetch Products
  // --------------------------
  const getProductData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
        preloadImages(response.data.products);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
      setLoading(false);
    }
  };

  const preloadImages = (products) => {
    const images = products
      .map((p) => (Array.isArray(p.image) ? p.image[0] : p.image))
      .concat([
        assets.about_img,
        assets.contact_img,
        assets.cart_icon,
        assets.profile_icon,
        assets.search_icon,
        assets.menu_icon,
        assets.dropdown_icon,
      ]);

    let loaded = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === images.length) setLoading(false);
      };
    });
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  // --------------------------
  // 🔹 Cart Functions
  // --------------------------
  const addToCart = async (itemId) => {
    setCartItems((prevCart) => {
      const newCart = { ...prevCart };
      newCart[itemId] = (newCart[itemId] || 0) + 1;
      return newCart;
    });
    toast.success("Added to cart");

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Add to cart error:", error);
        toast.error(error.response?.data?.message || "Failed to add to cart");
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setCartItems((prevCart) => {
      const newCart = { ...prevCart };
      if (quantity <= 0) {
        delete newCart[itemId];
      } else {
        newCart[itemId] = quantity;
      }
      return newCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/update`,
          { itemId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Update quantity error:", error);
        toast.error(error.response?.data?.message || "Failed to update cart");
      }
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (response.data.success) setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Get cart error:", error);
      toast.error(error.response?.data?.message || "Failed to load cart");
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.price * cartItems[id];
    }
    return total;
  };

  // --------------------------
  // 🔹 Order Functions
  // --------------------------
  
  // ✅ Place Order (COD with OTP)
  const placeOrder = async (address) => {
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return { success: false };
    }

    const items = Object.entries(cartItems)
      .map(([id, qty]) => {
        const product = products.find((p) => p._id === id);
        if (!product) return null;
        return {
          _id: id, // ✅ Include product ID
          name: product.name,
          quantity: qty,
          price: product.price,
          image: product.image, // ✅ Include image for order display
          size: product.size || null, // ✅ Include size if exists
        };
      })
      .filter((item) => item !== null);

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return { success: false };
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          items,
          address,
          amount: getCartAmount() + delivery_fee,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.info("📧 OTP sent to your email. Please check and verify.");
        return { 
          success: true,
          orderId: response.data.orderId, 
          requiresOtp: true 
        };
      } else {
        toast.error(response.data.message);
        return { success: false };
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      return { success: false };
    }
  };

  // ✅ Verify Order OTP
  const verifyOrderOtp = async (orderId, otp) => {
    if (!token) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/verify-otp`,
        { orderId, otp },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("✅ Order confirmed successfully!");
        setCartItems({}); // Clear cart
        await fetchUserOrders(); // ✅ Refresh orders
        navigate("/orders");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
      return false;
    }
  };

  // ✅ Resend Order OTP
  const resendOrderOtp = async (orderId) => {
    if (!token) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/resend-otp`,
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("📧 New OTP sent to your email");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return false;
    }
  };

  // ✅ Get User Orders
  const fetchUserOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setUserOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    }
  };

  // ✅ Cancel Order
  const cancelOrder = async (orderId) => {
    if (!token) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        await fetchUserOrders(); // Refresh orders
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
      return false;
    }
  };

  // ✅ Fetch orders when token is available
  useEffect(() => {
    if (token) {
      fetchUserOrders();
    }
  }, [token]);

  // --------------------------
  // 🔹 Product Review Functions
  // --------------------------
  const getSingleProduct = async (productId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/single`, {
        productId,
      });
      if (response.data.success) {
        return response.data.product;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Get product error:", error);
      toast.error(error.response?.data?.message || "Failed to load product");
      return null;
    }
  };

  const addProductReview = async (productId, rating, comment) => {
    if (!token) {
      toast.error("Please login to add a review");
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId, rating, comment },
        { headers: { token } } // ✅ Fixed: Use 'token' instead of 'Authorization: Bearer'
      );

      if (response.data.success) {
        toast.success("Review added successfully!");
        await getProductData(); // Refresh products
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Add review error:", error);
      toast.error(error.response?.data?.message || "Failed to add review");
      return false;
    }
  };

  // --------------------------
  // 🔹 Auth Functions
  // --------------------------
  const registerUser = async (name, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        toast.success("📧 OTP sent to your email");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("✅ Account verified successfully!");
        navigate("/");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(error.response?.data?.message || "Verification failed");
      return false;
    }
  };

  const loginUser = async (email, password, useOTP = false) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
        useOTP,
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Login successful");
        navigate("/");
        return true;
      } else if (response.data.success && !response.data.token) {
        toast.info("📧 OTP sent to your email");
        return "otp_sent";
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const verifyLoginOTP = async (email, otp) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/verify-login-otp`,
        { email, otp }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Login successful");
        navigate("/");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Verify login OTP error:", error);
      toast.error(error.response?.data?.message || "Verification failed");
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );
      if (response.data.success) {
        toast.success("📧 Password reset OTP sent to your email");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return false;
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        { email, otp, newPassword }
      );
      if (response.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Password reset failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setUserOrders([]);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // --------------------------
  // 🔹 Context Value
  // --------------------------
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    registerUser,
    verifyOTP,
    loginUser,
    verifyLoginOTP,
    forgotPassword,
    resetPassword,
    logout,
    loading,
    getSingleProduct,
    addProductReview,
    
    // ✅ Order Functions
    placeOrder,
    verifyOrderOtp,
    resendOrderOtp,     // ✅ Added
    fetchUserOrders,    // ✅ Added
    cancelOrder,        // ✅ Added
    userOrders,         // ✅ Added
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;