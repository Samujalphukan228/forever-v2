import React, { useState, useContext, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
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
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "", phone: "",
  });

  const {
    navigate, token, cartItems,
    placeOrder, verifyOrderOtp, resendOrderOtp,
  } = useContext(ShopContext);

  const requiredFields = ["firstName","lastName","email","street","city","state","zipcode","country","phone"];

  const getFieldError = (name) => {
    const v = formData[name]?.trim() || "";
    if (!touched[name]) return "";
    if (!v) return "This field is required";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
    if (name === "phone" && v.replace(/\D/g, "").length < 10) return "Phone must be at least 10 digits";
    if (name === "zipcode" && v.length < 4) return "Invalid zip code";
    return "";
  };

  const hasErrors = useMemo(
    () => requiredFields.some((f) => getFieldError(f)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData, touched]
  );

  const isFormValid = useMemo(
    () =>
      requiredFields.every((f) => String(formData[f] || "").trim()) && !hasErrors,
    [formData, hasErrors]
  );

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const onBlurHandler = (name) => {
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }

    if (!cartItems || Object.values(cartItems).every(q => q <= 0)) {
      toast.error("Your cart is empty!");
      navigate("/cart");
      return;
    }

    // mark all as touched to show errors
    const allTouched = requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (method === "cod") {
        const result = await placeOrder(formData);
        if (result?.success && result?.requiresOtp) {
          setTempOrderId(result.orderId);
          setOtpModal(true);
        } else if (result?.success) {
          toast.success("Order placed successfully!");
          navigate("/orders");
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

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    pasted.forEach((c, i) => (next[i] = c));
    setOtp(next);
    const firstEmpty = next.findIndex((v) => !v);
    document.getElementById(`otp-${firstEmpty === -1 ? 5 : firstEmpty}`)?.focus();
  };

  const handleOtpVerification = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
    setIsVerifying(true);
    try {
      const success = await verifyOrderOtp(tempOrderId, code);
      if (success) {
        toast.success("Order verified!");
        closeOtpModal();
        navigate("/orders");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
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
      toast.success("New code sent!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  const closeOtpModal = () => {
    setOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
    setTempOrderId(null);
  };

  // Modal a11y: lock scroll, Esc to close
  useEffect(() => {
    if (otpModal) {
      document.body.style.overflow = "hidden";
      const esc = (e) => e.key === "Escape" && closeOtpModal();
      window.addEventListener("keydown", esc);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 50);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", esc);
      };
    }
  }, [otpModal]);

  return (
    <>
      <div className="min-h-screen pt-24 lg:pt-28 pb-12 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extralight text-black mb-2">Checkout</h1>
            <p className="text-gray-600 font-light">Complete your order in a few simple steps</p>
          </div>

          <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Delivery info + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Information */}
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black flex items-center justify-center">
                    <span className="text-white text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-black">Delivery Information</h2>
                    <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "firstName", label: "First Name *", placeholder: "John" },
                    { name: "lastName", label: "Last Name *", placeholder: "Doe" },
                    { name: "email", label: "Email Address *", placeholder: "john.doe@example.com", type: "email", full: true },
                    { name: "street", label: "Street Address *", placeholder: "123 Main Street, Apt 4B", full: true },
                    { name: "city", label: "City *", placeholder: "New York" },
                    { name: "state", label: "State *", placeholder: "NY" },
                    { name: "zipcode", label: "Zip Code *", placeholder: "10001" },
                    { name: "country", label: "Country *", placeholder: "United States" },
                    { name: "phone", label: "Phone Number *", placeholder: "+1 (555) 123-4567", type: "tel", full: true },
                  ].map((f) => (
                    <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-black mb-2 uppercase tracking-[0.15em]">
                        {f.label}
                      </label>
                      <input
                        required
                        type={f.type || "text"}
                        name={f.name}
                        value={formData[f.name]}
                        onChange={onChangeHandler}
                        onBlur={() => onBlurHandler(f.name)}
                        placeholder={f.placeholder}
                        inputMode={f.name === "phone" ? "tel" : f.name === "zipcode" ? "numeric" : "text"}
                        className={`w-full px-4 py-3 border focus:outline-none transition-colors text-sm ${
                          getFieldError(f.name) ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-black"
                        }`}
                        aria-invalid={!!getFieldError(f.name)}
                      />
                      {getFieldError(f.name) && (
                        <p className="text-red-500 text-xs mt-1">{getFieldError(f.name)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black flex items-center justify-center">
                    <span className="text-white text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-black">Payment Method</h2>
                    <p className="text-xs text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "stripe", logo: assets.stripe_logo, name: "Stripe" },
                    { id: "razorpay", logo: assets.razorpay_logo, name: "Razorpay" },
                    { id: "cod", label: "Cash on Delivery", name: "COD" },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`relative border p-4 cursor-pointer transition-all ${
                        method === m.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-black"
                      }`}
                      aria-pressed={method === m.id}
                    >
                      {method === m.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-black flex items-center justify-center">
                          <FiCheckCircle className="text-white text-sm" />
                        </div>
                      )}
                      <div className="flex flex-col items-center justify-center gap-2 h-full">
                        {m.logo && <img src={m.logo} alt={m.name} className="h-6" />}
                        {m.label && <span className="text-xs font-medium text-black text-center">{m.label}</span>}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 p-3">
                  <FiShield className="w-4 h-4" />
                  <span className="uppercase tracking-[0.15em]">Secure payment • SSL encrypted</span>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <CartTotel showCheckoutButton={false} />

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={`w-full py-4 text-xs uppercase tracking-[0.15em] font-medium text-white transition-all ${
                    isSubmitting || !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md shadow-2xl animate-scale-up">
            {/* Header */}
            <div className="relative bg-black text-white p-8">
              <button
                onClick={closeOtpModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 transition-all"
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-3xl" />
                </div>
                <h2 className="text-2xl font-medium mb-2">Verify Your Order</h2>
                <p className="text-gray-300 text-sm">We've sent a verification code to</p>
                <p className="text-white font-medium mt-1 break-all">{formData.email}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-8">
              <p className="text-gray-600 text-center mb-8">Enter the 6-digit code to confirm your order</p>

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
                    className="w-12 h-14 text-center text-2xl font-medium border-2 border-gray-300 focus:outline-none focus:border-black transition-all"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="text-center mb-8">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-sm text-gray-600 hover:text-black transition-all inline-flex items-center gap-2 font-medium"
                >
                  <FiRefreshCw className={`${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Sending new code..." : "Resend Code"}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeOtpModal}
                  className="flex-1 px-6 py-3 border border-gray-300 font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOtpVerification}
                  disabled={isVerifying || otp.join("").length !== 6}
                  className={`flex-1 px-6 py-3 font-medium transition-all ${
                    isVerifying || otp.join("").length !== 6
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
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

              <div className="mt-6 p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">⏱️ Code expires in 10 minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up { animation: scale-up 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default PlaceOrder;