import { FiMenu, FiLogOut } from "react-icons/fi";

const NavBar = ({ setAdminToken, setSidebarOpen }) => {
  const handleLogout = () => {
    setAdminToken("");
    localStorage.removeItem("adminToken");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Right */}
      <div className="ml-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <FiLogOut className="w-4 h-4" />
          {/* <span>Logout</span> */}
        </button>
      </div>
    </header>
  );
};

export default NavBar;