import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiUser,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

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

  // Refs for animations
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);
  const inputRefs = useRef([]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Initial page load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      gsap.set([logoRef.current, cardRef.current], {
        opacity: 0,
        y: 30
      });

      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      })
      .to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate form state changes
  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      // Animate form content change
      gsap.fromTo([titleRef.current, subtitleRef.current],
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );

      // Animate inputs
      gsap.fromTo(inputRefs.current,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.3, 
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.2
        }
      );

      // Animate button
      gsap.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.4)", delay: 0.4 }
      );

      // Animate footer
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, delay: 0.5 }
      );
    }, formRef);

    // Reset form data when state changes
    setFormData({
      name: "",
      email: "",
      password: "",
      otp: "",
      newPassword: "",
    });
    setShowPassword(false);

    return () => ctx.revert();
  }, [currentState]);

  // Eye icon animation
  const togglePassword = () => {
    const eyeButton = document.querySelector('.eye-button');
    gsap.to(eyeButton, {
      rotate: showPassword ? 0 : 180,
      duration: 0.3,
      ease: "power2.inOut"
    });
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Animate button loading state
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1
    });

    try {
      let response;

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
      } else if (currentState === "Verify OTP") {
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
      } else if (currentState === "Login") {
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
      } else if (currentState === "Forgot Password") {
        response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
          email: formData.email,
        });

        if (response.data.success) {
          toast.success("OTP sent to your email");
          setCurrentState("Reset Password");
        } else toast.error(response.data.message || "Failed to send OTP");
      } else if (currentState === "Reset Password") {
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
      
      // Shake animation on error
      gsap.to(cardRef.current, {
        x: [0, -10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    } finally {
      setIsLoading(false);
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.2
      });
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const getTitle = () => {
    switch (currentState) {
      case "Sign Up":
        return "Create Account";
      case "Login":
        return "Welcome Back";
      case "Verify OTP":
        return "Verify Email";
      case "Forgot Password":
        return "Forgot Password";
      case "Reset Password":
        return "Reset Password";
      default:
        return "Login";
    }
  };

  const getSubtitle = () => {
    switch (currentState) {
      case "Sign Up":
        return "Create your account to get started";
      case "Login":
        return "Sign in to continue to forEver";
      case "Verify OTP":
        return "Enter the 6-digit code sent to your email";
      case "Forgot Password":
        return "We'll send you a reset code";
      case "Reset Password":
        return "Create a new secure password";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Processing...";
    switch (currentState) {
      case "Sign Up":
        return "Create Account";
      case "Verify OTP":
        return "Verify Email";
      case "Forgot Password":
        return "Send Reset Code";
      case "Reset Password":
        return "Reset Password";
      default:
        return "Sign In";
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen  flex items-center justify-center pt-24 lg:pt-28 pb-40 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div ref={logoRef} className="text-center mb-8">
          <h1 className="text-3xl font-extralight text-black mb-2">forEver</h1>
          <div className="w-12 h-[1px] bg-black mx-auto"></div>
        </div>

        {/* Card */}
        <div ref={cardRef} className="bg-white border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 ref={titleRef} className="text-2xl font-light text-black mb-2">
              {getTitle()}
            </h2>
            <p ref={subtitleRef} className="text-sm text-gray-500 font-light">{getSubtitle()}</p>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={onSubmitHandler} className="space-y-5">
            {/* Sign Up */}
            {currentState === "Sign Up" && (
              <>
                <div ref={(el) => (inputRefs.current[0] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[1] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[2] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="eye-button absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Login */}
            {currentState === "Login" && (
              <>
                <div ref={(el) => (inputRefs.current[0] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[1] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="eye-button absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Verify OTP */}
            {currentState === "Verify OTP" && (
              <>
                <div ref={(el) => (inputRefs.current[0] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[1] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      required
                      maxLength="6"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-mono text-lg tracking-[0.3em]"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Forgot Password */}
            {currentState === "Forgot Password" && (
              <div ref={(el) => (inputRefs.current[0] = el)}>
                <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                    onFocus={(e) => {
                      gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                    }}
                    onBlur={(e) => {
                      gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                    }}
                  />
                </div>
              </div>
            )}

            {/* Reset Password */}
            {currentState === "Reset Password" && (
              <>
                <div ref={(el) => (inputRefs.current[0] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[1] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit code"
                      required
                      maxLength="6"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors font-mono text-lg tracking-[0.3em]"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                  </div>
                </div>

                <div ref={(el) => (inputRefs.current[2] = el)}>
                  <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Create a new password"
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-200 focus:outline-none focus:border-black transition-colors text-sm"
                      onFocus={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1.02, duration: 0.2 });
                      }}
                      onBlur={(e) => {
                        gsap.to(e.currentTarget.parentElement, { scale: 1, duration: 0.2 });
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="eye-button absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              ref={buttonRef}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 text-xs uppercase tracking-[0.15em] font-medium text-white flex items-center justify-center gap-2 transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  gsap.to(e.currentTarget, { scale: 1.02, duration: 0.2 });
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 3, duration: 0.2 });
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                  gsap.to(e.currentTarget.querySelector('svg'), { x: 0, duration: 0.2 });
                }
              }}
            >
              {getButtonText()}
              {!isLoading && <FiArrowRight size={16} />}
            </button>
          </form>

          {/* Footer Links */}
          <div ref={footerRef} className="text-center mt-8 text-xs text-gray-500">
            {currentState === "Login" && (
              <>
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentState("Sign Up")}
                    className="text-black font-medium hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentState("Forgot Password")}
                  className="mt-2 text-gray-500 hover:text-black transition-colors block mx-auto"
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
                  className="text-black font-medium hover:underline"
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
                  className="text-black font-medium hover:underline"
                >
                  Resend
                </button>
              </p>
            )}

            {currentState === "Forgot Password" && (
              <p>
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => setCurrentState("Login")}
                  className="text-black font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            )}

            {currentState === "Reset Password" && (
              <p>
                Back to{" "}
                <button
                  type="button"
                  onClick={() => setCurrentState("Login")}
                  className="text-black font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;