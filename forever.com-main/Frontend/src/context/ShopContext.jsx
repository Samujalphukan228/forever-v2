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
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Preload images
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
        toast.error(error.message);
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
        toast.error(error.message);
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
      toast.error(error.message);
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
  // 🔹 Place Order Function
  // --------------------------
  const placeOrder = async (address) => {
    if (!token) return toast.error("Please login to place an order");

    const items = Object.entries(cartItems)
      .map(([id, qty]) => {
        const product = products.find((p) => p._id === id);
        if (!product) return null;
        return {
          productId: id,
          name: product.name,
          quantity: qty,
          price: product.price,
        };
      })
      .filter((item) => item !== null);

    if (items.length === 0) return toast.error("Your cart is empty!");

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
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

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
      toast.error(error.response?.data?.message || error.message);
      return null;
    }
  };

  const addProductReview = async (productId, rating, comment) => {
    if (!token) return toast.error("Please login to add a review");
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/review`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Review added successfully!");
        getProductData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
        toast.success("OTP sent to your email");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
        toast.success("Account verified successfully!");
        navigate("/");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
      } else if (response.data.success && !response.data.token) {
        toast.info("OTP sent to your email for login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/forgot-password`,
        { email }
      );
      if (response.data.success) {
        toast.success("Password reset OTP sent to your email");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
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
    placeOrder, // ✅ Added order placement here
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
