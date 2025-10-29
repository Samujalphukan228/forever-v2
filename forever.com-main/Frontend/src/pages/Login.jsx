import React, { useContext, useEffect, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

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

  // ✅ Use useCallback to prevent function recreation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // ✅ Reset form when state changes
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      otp: "",
      newPassword: "",
    });
    setShowPassword(false);
  }, [currentState]);

  // Submit logic
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      // Sign Up
      if (currentState === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          toast.success("OTP sent to your email!");
          setCurrentState("Verify OTP");
        } else toast.error(response.data.message || "Sign Up failed");
      }

      // Verify OTP
      else if (currentState === "Verify OTP") {
        response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
          email: formData.email,
          otp: formData.otp,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Email verified successfully!");
          navigate("/");
        } else toast.error(response.data.message || "Invalid OTP");
      }

      // Login
      else if (currentState === "Login") {
        response = await axios.post(`${backendUrl}/api/user/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Logged in successfully!");
          navigate("/");
        } else toast.error(response.data.message || "Login failed");
      }

      // Forgot Password
      else if (currentState === "Forgot Password") {
        response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
          email: formData.email,
        });

        if (response.data.success) {
          toast.success("OTP sent to your email");
          setCurrentState("Reset Password");
        } else toast.error(response.data.message || "Failed to send OTP");
      }

      // Reset Password
      else if (currentState === "Reset Password") {
        response = await axios.post(`${backendUrl}/api/user/reset-password`, {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        });

        if (response.data.success) {
          toast.success("Password reset successful!");
          setCurrentState("Login");
        } else toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md p-8 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            {currentState === "Sign Up"
              ? "Create Account"
              : currentState === "Login"
              ? "Welcome Back"
              : currentState === "Verify OTP"
              ? "Verify Email"
              : currentState === "Forgot Password"
              ? "Forgot Password?"
              : "Reset Password"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {currentState === "Sign Up" && "Sign up to get started"}
            {currentState === "Login" && "Login to your account"}
            {currentState === "Verify OTP" && "Enter the OTP sent to your email"}
            {currentState === "Forgot Password" &&
              "Enter your email to receive OTP"}
            {currentState === "Reset Password" && "Set your new password"}
          </p>
        </div>

        {/* Fields */}
        {currentState === "Sign Up" && (
          <>
            {/* Name Input */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            
            {/* Email Input */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            
            {/* Password Input with Eye Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                  focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
              />
              <div
                className="absolute right-4 top-3 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </>
        )}

        {currentState === "Verify OTP" && (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
          </>
        )}

        {currentState === "Login" && (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                  focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
              />
              <div
                className="absolute right-4 top-3 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </>
        )}

        {currentState === "Forgot Password" && (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
              focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
          />
        )}

        {currentState === "Reset Password" && (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
            />
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 
                  focus:border-black focus:ring-1 focus:ring-black transition-all outline-none bg-transparent"
              />
              <div
                className="absolute right-4 top-3 cursor-pointer text-gray-600 hover:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </>
        )}

        {/* Links */}
        <div className="text-center text-sm text-gray-500">
          {currentState === "Login" && (
            <>
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="cursor-pointer hover:text-black transition"
              >
                Don't have an account?{" "}
                <span className="font-medium">Sign Up</span>
              </p>
              <p
                onClick={() => setCurrentState("Forgot Password")}
                className="cursor-pointer hover:text-black transition mt-1"
              >
                Forgot Password?
              </p>
            </>
          )}

          {currentState === "Sign Up" && (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:text-black transition"
            >
              Already have an account?{" "}
              <span className="font-medium">Login</span>
            </p>
          )}

          {(currentState === "Forgot Password" ||
            currentState === "Reset Password" ||
            currentState === "Verify OTP") && (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer hover:text-black transition"
            >
              Back to Login
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-semibold text-white 
            ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"} 
            transition-all duration-200`}
        >
          {isLoading
            ? "Processing..."
            : currentState === "Sign Up"
            ? "Register"
            : currentState === "Verify OTP"
            ? "Verify OTP"
            : currentState === "Forgot Password"
            ? "Send OTP"
            : currentState === "Reset Password"
            ? "Reset Password"
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;