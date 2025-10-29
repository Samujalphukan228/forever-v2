import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotel from "../components/CartTotel";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token)
      return toast.error("You must be logged in to place an order!");
    if (!cartItems || Object.keys(cartItems).length === 0)
      return toast.error("Your cart is empty!");

    try {
      // ✅ FIXED: Properly map flat cartItems into valid orderItems
      const orderItems = Object.keys(cartItems)
        .map((productId) => {
          const productInfo = products.find(
            (p) => p._id.toString() === productId.toString()
          );
          if (!productInfo) return null;

          const quantity = cartItems[productId];
          if (quantity <= 0) return null;

          return {
            productId: productInfo._id,
            name: productInfo.name,
            image: productInfo.image[0],
            price: productInfo.price,
            quantity,
          };
        })
        .filter((item) => item !== null);

      if (orderItems.length === 0) {
        return toast.error("No valid items to place an order!");
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      let response;

      // 🟢 Cash on Delivery
      if (method === "cod") {
        response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
          headers: { token },
        });

        if (response.data.success) {
          setCartItems({});
          toast.success("Order placed successfully!");
          navigate("/orders");
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
      }

      // 🟣 Stripe Payment
      else if (method === "stripe") {
        response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, {
          headers: { token },
        });

        if (response.data.success) {
          window.location.href = response.data.session_url;
        } else {
          toast.error(response.data.message || "Stripe order failed");
        }
      }

      // 🔴 Razorpay (not implemented)
      else if (method === "razorpay") {
        toast.info("Razorpay integration coming soon.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col lg:flex-row gap-8 pt-10 lg:pt-16 min-h-[80vh] px-4 lg:px-8"
    >
      {/* 🏠 Delivery Info */}
      <div className="flex-1 max-w-md flex flex-col gap-4">
        <Title text1="DELIVERY" text2="INFORMATION" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            required
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={onChangeHandler}
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          required
          name="street"
          value={formData.street}
          onChange={onChangeHandler}
          placeholder="Street"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder="City"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            required
            name="state"
            value={formData.state}
            onChange={onChangeHandler}
            placeholder="State"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            type="number"
            name="zipcode"
            value={formData.zipcode}
            onChange={onChangeHandler}
            placeholder="Zip Code"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            required
            name="country"
            value={formData.country}
            onChange={onChangeHandler}
            placeholder="Country"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <input
          required
          type="number"
          name="phone"
          value={formData.phone}
          onChange={onChangeHandler}
          placeholder="Phone"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* 💳 Cart & Payment */}
      <div className="flex-1 flex flex-col gap-6">
        <CartTotel showCheckoutButton={false} />

        <div className="flex flex-col sm:flex-row gap-3">
          {[
            { id: "stripe", label: "", logo: assets.stripe_logo },
            { id: "razorpay", label: "", logo: assets.razorpay_logo },
            { id: "cod", label: "CASH ON DELIVERY" },
          ].map((methodOption) => (
            <div
              key={methodOption.id}
              onClick={() => setMethod(methodOption.id)}
              className={`flex items-center gap-3 border p-2 px-4 cursor-pointer rounded transition ${
                method === methodOption.id ? "border-black" : "border-gray-300"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border ${
                  method === methodOption.id ? "bg-black" : ""
                }`}
              ></span>
              {methodOption.logo && (
                <img src={methodOption.logo} alt="" className="h-5" />
              )}
              {methodOption.label && (
                <span className="text-gray-900 font-medium">
                  {methodOption.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="w-full text-right">
          <button
            type="submit"
            className="bg-black text-white px-16 py-3 text-sm rounded hover:bg-gray-800 transition"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
