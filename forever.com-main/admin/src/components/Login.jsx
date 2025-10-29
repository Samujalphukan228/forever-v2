import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiAlertCircle,
  FiLogIn,
  FiShield,
  FiHome
} from "react-icons/fi";

const Login = ({ setAdminToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState("");

  // Validation
  const getEmailError = () => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return "";
  };

  const getPasswordError = () => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const isFormValid = email && password && !getEmailError() && !getPasswordError();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    
    if (!isFormValid) {
      setError("Please fill in all fields correctly");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/admin`, { 
        email, 
        password 
      });
      
      if (data.success) {
        setAdminToken(data.token);
        localStorage.setItem("adminToken", data.token);
        toast.success("Welcome back, Admin! 🎉");
      } else {
        setError(data.message || "Invalid credentials");
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <FiHome className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            forEver Admin
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
            <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-medium flex-1">{error}</p>
            <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
              <FiX />
            </button>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 sm:p-8">
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <FiShield className="text-blue-600 text-lg" />
            <span className="text-sm font-medium text-blue-900">Secure Admin Access</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  placeholder="admin@forever.com"
                  className={`w-full pl-11 pr-10 py-3 border-2 rounded-xl transition-all outline-none ${
                    getEmailError()
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  disabled={loading}
                />
                {email && !getEmailError() && touched.email && (
                  <FiCheck className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
              </div>
              {getEmailError() && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <FiAlertCircle className="flex-shrink-0" />
                  {getEmailError()}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl transition-all outline-none ${
                    getPasswordError()
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
              {getPasswordError() && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <FiAlertCircle className="flex-shrink-0" />
                  {getPasswordError()}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                loading || !isFormValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn className="text-xl" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <FiAlertCircle className="text-gray-500" />
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Email: <code className="bg-white px-2 py-0.5 rounded border border-gray-200">admin@forever.com</code></p>
              <p>Password: <code className="bg-white px-2 py-0.5 rounded border border-gray-200">admin123</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Protected by enterprise-grade security
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="text-xs text-gray-500">© 2024 forEver</span>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700">Privacy Policy</a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700">Terms</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;