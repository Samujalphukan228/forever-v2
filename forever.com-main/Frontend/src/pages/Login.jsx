import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

// Simple icon components to avoid react-icons bundle size
const Icons = {
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Spinner: () => (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
};

// Reusable Input Component
const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  maxLength,
  isOtp,
}) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-medium text-gray-600 uppercase tracking-[0.15em]">
      {label}
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-black">
        <Icon />
      </span>
      <input
        type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        maxLength={maxLength}
        className={`w-full pl-11 pr-${showPasswordToggle ? "12" : "4"} py-3.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:outline-none transition-all duration-200 text-sm ${
          isOtp ? "font-mono text-base tracking-[0.4em] text-center" : ""
        }`}
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      )}
    </div>
  </div>
);

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Reset form when state changes
  useEffect(() => {
    setFormData({
      name: "",
      email: formData.email, // Keep email for convenience
      password: "",
      otp: "",
      newPassword: "",
    });
    setShowPassword(false);
  }, [currentState]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      const endpoints = {
        "Sign Up": { url: "/api/user/register", data: { name: formData.name, email: formData.email, password: formData.password } },
        "Verify OTP": { url: "/api/user/verify-otp", data: { email: formData.email, otp: formData.otp } },
        "Login": { url: "/api/user/login", data: { email: formData.email, password: formData.password } },
        "Forgot Password": { url: "/api/user/forgot-password", data: { email: formData.email } },
        "Reset Password": { url: "/api/user/reset-password", data: { email: formData.email, otp: formData.otp, newPassword: formData.newPassword } },
      };

      const endpoint = endpoints[currentState];
      response = await axios.post(`${backendUrl}${endpoint.url}`, endpoint.data);

      if (response.data.success) {
        const successActions = {
          "Sign Up": () => {
            toast.success("OTP sent to your email!");
            setCurrentState("Verify OTP");
          },
          "Verify OTP": () => {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Email verified successfully!");
            navigate("/");
          },
          "Login": () => {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Logged in successfully!");
            navigate("/");
          },
          "Forgot Password": () => {
            toast.success("OTP sent to your email");
            setCurrentState("Reset Password");
          },
          "Reset Password": () => {
            toast.success("Password reset successful!");
            setCurrentState("Login");
          },
        };
        successActions[currentState]();
      } else {
        toast.error(response.data.message || "Something went wrong");
        triggerShake();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const content = {
    "Sign Up": {
      title: "Create Account",
      subtitle: "Start your journey with forEver",
      button: "Create Account",
    },
    "Login": {
      title: "Welcome Back",
      subtitle: "Sign in to continue to forEver",
      button: "Sign In",
    },
    "Verify OTP": {
      title: "Verify Email",
      subtitle: "Enter the 6-digit code sent to your email",
      button: "Verify Email",
    },
    "Forgot Password": {
      title: "Forgot Password",
      subtitle: "We'll send you a reset code",
      button: "Send Reset Code",
    },
    "Reset Password": {
      title: "Reset Password",
      subtitle: "Create a new secure password",
      button: "Reset Password",
    },
  };

  const { title, subtitle, button } = content[currentState];

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 lg:pt-28 pb-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div
        className={`w-full max-w-md transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extralight tracking-wide text-black mb-3">
            forEver
          </h1>
          <div className="w-12 h-px bg-black/20 mx-auto" />
        </div>

        {/* Card */}
        <div
          className={`bg-white border border-gray-200 shadow-sm transition-transform duration-500 ${
            shake ? "animate-shake" : ""
          }`}
        >
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                key={title}
                className="text-2xl font-light text-black mb-2 animate-fadeIn"
              >
                {title}
              </h2>
              <p className="text-sm text-gray-500 font-light animate-fadeIn animation-delay-100">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Sign Up Fields */}
              {currentState === "Sign Up" && (
                <>
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    icon={Icons.User}
                  />
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={Icons.Mail}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    icon={Icons.Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </>
              )}

              {/* Login Fields */}
              {currentState === "Login" && (
                <>
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={Icons.Mail}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    icon={Icons.Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </>
              )}

              {/* Verify OTP Fields */}
              {currentState === "Verify OTP" && (
                <>
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={Icons.Mail}
                  />
                  <FormInput
                    label="Verification Code"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="000000"
                    icon={Icons.Shield}
                    maxLength={6}
                    isOtp
                  />
                </>
              )}

              {/* Forgot Password Fields */}
              {currentState === "Forgot Password" && (
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  icon={Icons.Mail}
                />
              )}

              {/* Reset Password Fields */}
              {currentState === "Reset Password" && (
                <>
                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    icon={Icons.Mail}
                  />
                  <FormInput
                    label="Verification Code"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="000000"
                    icon={Icons.Shield}
                    maxLength={6}
                    isOtp
                  />
                  <FormInput
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Create a new password"
                    icon={Icons.Lock}
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`group w-full py-4 text-[11px] uppercase tracking-[0.15em] font-medium text-white flex items-center justify-center gap-3 transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Icons.Spinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{button}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <Icons.ArrowRight />
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="text-center mt-8 text-xs text-gray-500 space-y-2">
              {currentState === "Login" && (
                <>
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setCurrentState("Sign Up")}
                      className="text-black font-medium hover:underline underline-offset-2"
                    >
                      Sign Up
                    </button>
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentState("Forgot Password")}
                    className="text-gray-400 hover:text-black transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </>
              )}

              {currentState === "Sign Up" && (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Login")}
                    className="text-black font-medium hover:underline underline-offset-2"
                  >
                    Login
                  </button>
                </p>
              )}

              {currentState === "Verify OTP" && (
                <p>
                  Didn't get the code?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Sign Up")}
                    className="text-black font-medium hover:underline underline-offset-2"
                  >
                    Resend
                  </button>
                </p>
              )}

              {(currentState === "Forgot Password" || currentState === "Reset Password") && (
                <p>
                  Back to{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Login")}
                    className="text-black font-medium hover:underline underline-offset-2"
                  >
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[10px] text-gray-400 mt-6 tracking-wide">
          Your data is protected with 256-bit encryption
        </p>
      </div>
    </div>
  );
};

export default Login;