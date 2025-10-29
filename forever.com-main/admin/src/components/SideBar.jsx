import { NavLink } from "react-router-dom";
import { FiPackage, FiList, FiShoppingCart, FiTrendingUp, FiHome } from "react-icons/fi";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { to: "/add", label: "Add Items", icon: FiPackage },
    { to: "/list", label: "List Items", icon: FiList },
    { to: "/orders", label: "Orders", icon: FiShoppingCart },
  ];

  return (
    <aside className="hidden lg:flex w-72 min-h-screen bg-white border-r-2 border-gray-200 flex-col sticky top-0 shadow-sm">
      
      {/* Sidebar Header */}
      <div className="p-6 border-b-2 border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <FiHome className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              forEver
            </h2>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
          Main Menu
        </p>
        
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all relative overflow-hidden ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon Container */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? "bg-white/20" 
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <Icon className={`text-lg ${isActive ? "text-white" : "text-gray-600"}`} />
                </div>
                
                {/* Label */}
                <span className="flex-1">{label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats Section */}
      <div className="p-4 border-t-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="text-green-500 text-lg" />
            <span className="text-xs font-semibold text-gray-700">Quick Stats</span>
          </div>
          <p className="text-xs text-gray-500">
            Welcome back! Manage your products and orders efficiently.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;