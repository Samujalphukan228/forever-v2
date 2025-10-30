import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Title from "../components/Title";
import CartTotel from "../components/CartTotel";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { FiX, FiMail, FiRefreshCw, FiShield, FiCheckCircle } from "react-icons/fi";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [tempOrderId, setTempOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [touched, setTouched] = useState({});

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
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    placeOrder,
    verifyOrderOtp,
    resendOrderOtp,
  } = useContext(ShopContext);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onBlurHandler = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getFieldError = (name) => {
    if (!touched[name] || !formData[name]) return "";
    
    switch(name) {
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[name]) 
          ? "Invalid email address" : "";
      case "phone":
        return formData[name].length < 10 
          ? "Phone number must be at least 10 digits" : "";
      case "zipcode":
        return formData[name].length < 5 
          ? "Invalid zip code" : "";
      default:
        return "";
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }

    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty!");
      navigate("/cart");
      return;
    }

    setIsSubmitting(true);

    try {
      if (method === "cod") {
        const result = await placeOrder(formData);
        
        if (result.success && result.requiresOtp) {
          setTempOrderId(result.orderId);
          setOtpModal(true);
        }
      } else if (method === "stripe") {
        toast.info("Stripe payment coming soon");
      } else if (method === "razorpay") {
        toast.info("Razorpay integration coming soon");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✨ Enhanced OTP Input Handler
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      if (/^\d$/.test(char) && index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastFilledIndex = newOtp.findIndex(val => !val);
    document.getElementById(`otp-${lastFilledIndex === -1 ? 5 : lastFilledIndex}`)?.focus();
  };

  const handleOtpVerification = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const success = await verifyOrderOtp(tempOrderId, otpString);
      
      if (success) {
        setOtpModal(false);
        setOtp(["", "", "", "", "", ""]);
        setTempOrderId(null);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      await resendOrderOtp(tempOrderId);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const closeOtpModal = () => {
    setOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
    setTempOrderId(null);
  };

  return (
    <>
      <div className="min-h-screen  py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">Complete your order in a few simple steps</p>
          </div>

          <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Delivery Information</h2>
                    <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={onChangeHandler}
                      onBlur={() => onBlurHandler("firstName")}
                      placeholder="John"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={onChangeHandler}
                      onBlur={() => onBlurHandler("lastName")}
                      placeholder="Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChangeHandler}
                      onBlur={() => onBlurHandler("email")}
                      placeholder="john.doe@example.com"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        getFieldError("email") 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-200 focus:border-black"
                      }`}
                    />
                    {getFieldError("email") && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError("email")}</p>
                    )}
                  </div>

                  {/* Street */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      required
                      name="street"
                      value={formData.street}
                      onChange={onChangeHandler}
                      placeholder="123 Main Street, Apt 4B"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={onChangeHandler}
                      placeholder="New York"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      required
                      name="state"
                      value={formData.state}
                      onChange={onChangeHandler}
                      placeholder="NY"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Zip Code *
                    </label>
                    <input
                      required
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={onChangeHandler}
                      onBlur={() => onBlurHandler("zipcode")}
                      placeholder="10001"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        getFieldError("zipcode") 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-200 focus:border-black"
                      }`}
                    />
                    {getFieldError("zipcode") && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError("zipcode")}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      required
                      name="country"
                      value={formData.country}
                      onChange={onChangeHandler}
                      placeholder="United States"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={onChangeHandler}
                      onBlur={() => onBlurHandler("phone")}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        getFieldError("phone") 
                          ? "border-red-300 focus:border-red-500" 
                          : "border-gray-200 focus:border-black"
                      }`}
                    />
                    {getFieldError("phone") && (
                      <p className="text-red-500 text-xs mt-1">{getFieldError("phone")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "stripe", logo: assets.stripe_logo, name: "Stripe" },
                    { id: "razorpay", logo: assets.razorpay_logo, name: "Razorpay" },
                    { id: "cod", label: "Cash on Delivery", name: "COD" },
                  ].map((methodOption) => (
                    <div
                      key={methodOption.id}
                      onClick={() => setMethod(methodOption.id)}
                      className={`relative border-2 p-4 rounded-xl cursor-pointer transition-all ${
                        method === methodOption.id
                          ? "border-black bg-gray-50 shadow-md"
                          : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                      }`}
                    >
                      {method === methodOption.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <FiCheckCircle className="text-white text-sm" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center justify-center h-full gap-2">
                        {methodOption.logo && (
                          <img src={methodOption.logo} alt={methodOption.name} className="h-6" />
                        )}
                        {methodOption.label && (
                          <span className="text-xs font-semibold text-gray-900 text-center">
                            {methodOption.label}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <FiShield className="text-green-600" />
                  <span>Secure payment • SSL encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <CartTotel showCheckoutButton={false} />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all transform ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* =================== ENHANCED OTP MODAL =================== */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="relative bg-black text-white p-8">
              <button
                onClick={closeOtpModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <FiX className="text-xl" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-3xl" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verify Your Order</h2>
                <p className="text-gray-300 text-sm">
                  We've sent a verification code to
                </p>
                <p className="text-white font-semibold mt-1">{formData.email}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <p className="text-gray-600 text-center mb-8">
                Enter the 6-digit code to confirm your order
              </p>

              {/* OTP Input Boxes */}
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-all"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center mb-8">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-gray-600 hover:text-black transition-all inline-flex items-center gap-2 font-medium"
                >
                  <FiRefreshCw className={`${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? "Sending new code..." : "Resend Code"}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeOtpModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOtpVerification}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isVerifying || otp.join("").length !== 6
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Order"
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 text-center">
                  ⏱️ Code expires in 10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default PlaceOrder;