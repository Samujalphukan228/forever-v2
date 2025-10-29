import { useState } from "react";
import { FiMenu, FiX, FiPackage, FiList, FiShoppingCart, FiLogOut, FiHome } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const NavBar = ({ setAdminToken, setSidebarOpen }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navItems = [
    { to: "/add", label: "Add Items", icon: FiPackage },
    { to: "/list", label: "List Items", icon: FiList },
    { to: "/orders", label: "Orders", icon: FiShoppingCart },
  ];

  const handleLogout = () => {
    console.log("Logging out..."); // Debug
    
    // Clear token from state
    setAdminToken("");
    
    // Clear all tokens from localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    
    // Close mobile menu
    setIsNavOpen(false);
    
    // Force page reload to reset all state
    window.location.href = "/";
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                forEver
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Admin Panel</p>
            </div>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-sm font-semibold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Logged in</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiLogOut className="text-lg" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsNavOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <FiMenu className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
          isNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsNavOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiHome className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">forEver</h2>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={() => setIsNavOpen(false)}
            className="p-2 rounded-xl hover:bg-white transition-all"
          >
            <FiX className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsNavOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-xl ${isActive ? "text-white" : "text-gray-600"}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-200 bg-gray-50">
          <div className="mb-3 p-3 bg-white rounded-xl border border-gray-200">
            <p className="text-sm font-semibold text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@forever.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default NavBar;